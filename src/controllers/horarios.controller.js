import { getConnection, querysHorarios } from "../database";
import sql from 'mssql';
import cron from 'node-cron';
import moment from 'moment';
import { addSpecificCita,eliminarCitasPorDia } from './citas.controller';

// Obtener los horarios de atención
export const obtenerHorariosAtencion = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(querysHorarios.getAllHorarios);
        res.json(result.recordset);
    } catch (error) {
        console.error("Error al obtener los horarios de atención:", error);
        res.status(500).send("Error interno del servidor");
    }
};

// Actualizar un horario de atención
export const actualizarHorarioAtencion = async (req, res) => {
    const { dia } = req.params;
    const { horaInicio, horaFin, estado } = req.body;
    
    const estadoReal = estado == "true" ? 1 : 0;
    try {
        const pool = await getConnection();
        await pool
            .request()
            .input('dia', sql.VarChar, dia)
            .input('horaInicio', sql.VarChar, horaInicio)
            .input('HoraFin', sql.VarChar, horaFin)
            .input('estado', sql.Bit, estadoReal)
            .query(querysHorarios.updateHorarios);
        
         await eliminarCitasPorDia(dia);
         console.log(estadoReal);
         if(estadoReal != 0){
            const horarios = await obtenerHorariosDia(dia);
            const response = await recrearCitasSegunHorario2(horarios, res); // Obtener la respuesta de recrearCitasSegunHorario2
            res.json(response); // Enviar la respuesta al cliente
         } else {
            res.json({ msg: 'Horario de atención actualizado correctamente' }); // Enviar la respuesta al cliente si no se recrean citas
         }
    } catch (error) {
        console.error("Error al actualizar el horario de atención:", error);
        res.status(500).send("Error interno del servidor");
    }
};

// Generar citas automáticamente
const generarCitasAutomaticamente = cron.schedule('0 8 * * 1-5', async () => {
    try {
        console.log('Generando citas automáticamente...');
        
        const horarios = await obtenerHorariosActivos();
        
        // Iterar sobre cada día de la semana
        for (let horario of horarios) {
            // Obtener el día actual de la semana
            const today = moment().day(horario.Dia);
            
            // Iterar sobre el rango de tiempo del horario en intervalos de 30 minutos
            for (let j = 0; j < horario.Intervalos; j++) {
                // Calcular la hora de inicio y fin para la cita
                const startHour = today.clone().hour(horario.HoraInicio.hour).minute(horario.HoraInicio.minute + j * 30).format('YYYY-MM-DD HH:mm:ss');
                const endHour = today.clone().hour(horario.HoraFin.hour).minute(horario.HoraFin.minute + j * 30).format('YYYY-MM-DD HH:mm:ss');
                
                await addSpecificCita(5, 10, startCita, endCita, ''); // Pasar los valores correspondientes
            }
        }
    } catch (error) {
        console.error('Error al generar citas automáticamente:', error);
    }
}, {
    scheduled: true, // Indica que esta tarea está programada
    timezone: 'America/Mexico_City', // Configura la zona horaria
});

// Inicia la tarea programada
generarCitasAutomaticamente.start();

// Obtener horarios activos
const obtenerHorariosActivos = async () => {
    const pool = await getConnection();
    const result = await pool.request().query(querysHorarios.getHorariosActivos);
    return result.recordset;
};

// Obtener horarios dia
const obtenerHorariosDia = async (Dia) => {
    const pool = await getConnection();
    const result = await pool  
        .request()
        .input('Dia', sql.VarChar, Dia)
        .query(querysHorarios.getHorariosDia);
    return result.recordset;
};
const obtenerNumeroDia = (nombreDia) => {
    switch (nombreDia.toLowerCase()) {
        case 'lunes':
            return 1;
        case 'martes':
            return 2;
        case 'miércoles':
            return 3;
        case 'jueves':
            return 4;
        case 'viernes':
            return 5;
        case 'sábado':
            return 6;
        case 'domingo':
            return 0;
        default:
            return -1; // Si el nombre del día no es válido
    }
};

const recrearCitasSegunHorario2 = async (horarios, res) => {
    try {
        console.log('Generando citas nuevas..........');

        for (let horario of horarios) {
            const dia = obtenerNumeroDia(horario.Dia);
            const dayOfWeek = moment().day(dia); // Convertir el nombre del día a minúsculas para garantizar la coincidencia con el formato esperado
            const startHour = moment(horario.HoraInicio);
            const endHour = moment(horario.HoraFin);
            const startDate = dayOfWeek.clone().hour(startHour.hour()).minute(startHour.minute());
            const endDate = dayOfWeek.clone().hour(endHour.hour()).minute(endHour.minute());

            let currentDateTime = startDate.clone();

            // Iterar hasta que la fecha y hora actual sea menor que la fecha de finalización de la cita
            while (currentDateTime.isBefore(endDate)) {
                // Crear la cita con la fecha y hora actual
                const startCita = currentDateTime.format('YYYY-MM-DD HH:mm:ss');
                const endCita = currentDateTime.clone().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

                await addSpecificCita(5, 10, startCita, endCita, ''); // Pasar los valores correspondientes

                // Avanzar al siguiente intervalo de 30 minutos
                currentDateTime.add(30, 'minutes');
            }
        }

        return { msg: 'Citas recreadas correctamente' }; // Retornar la respuesta en lugar de enviarla directamente
    } catch (error) {
        console.error('Error al recrear citas según horario:', error);
        throw new Error("Error interno del servidor"); // Lanzar un error en lugar de enviar una respuesta
    }
};



