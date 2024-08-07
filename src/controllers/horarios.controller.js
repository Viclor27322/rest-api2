import { getConnection, querysHorarios } from "../database";
import moment from 'moment';
import cron from 'node-cron';
import { addSpecificCita, eliminarCitasPorDia } from './citas.controller';

// Obtener los horarios de atención
export const obtenerHorariosAtencion = async (req, res) => {
    try {
        const pool = await getConnection();
        const [rows] = await pool.query(querysHorarios.getAllHorarios);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener los horarios de atención:", error);
        res.status(500).send("Error interno del servidor");
    }
};

// Actualizar un horario de atención
export const actualizarHorarioAtencion = async (req, res) => {
    const { dia } = req.params;
    const { HoraInicio, HoraFin, Estado } = req.body;
    const estadoReal = Estado === 1 ? 1 : 0;
    
    try {
        const pool = await getConnection();
        await pool.query(querysHorarios.updateHorarios, [HoraInicio, HoraFin, estadoReal, dia]);
        
        await eliminarCitasPorDia(dia);
        
        if (estadoReal !== 0) {
            const horarios = await obtenerHorariosDia(dia);
            const response = await recrearCitasSegunHorario2(horarios);
            res.json(response);
        } else {
            res.json({ msg: 'Horario de atención actualizado correctamente' });
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
        
        for (let horario of horarios) {
            const today = moment().day(horario.Dia);
            
            for (let j = 0; j < horario.Intervalos; j++) {
                const startHour = today.clone().hour(horario.HoraInicio.hour).minute(horario.HoraInicio.minute + j * 30).format('YYYY-MM-DD HH:mm:ss');
                const endHour = today.clone().hour(horario.HoraFin.hour).minute(horario.HoraFin.minute + j * 30).format('YYYY-MM-DD HH:mm:ss');
                
                await addSpecificCita(5, 10, startHour, endHour, ''); // Pasar los valores correspondientes
            }
        }
    } catch (error) {
        console.error('Error al generar citas automáticamente:', error);
    }
}, {
    scheduled: true,
    timezone: 'America/Mexico_City',
});

// Inicia la tarea programada
generarCitasAutomaticamente.start();

// Obtener horarios activos
const obtenerHorariosActivos = async () => {
    const pool = await getConnection();
    const [rows] = await pool.query(querysHorarios.getHorariosActivos);
    return rows;
};

// Obtener horarios por día
const obtenerHorariosDia = async (dia) => {
    const pool = await getConnection();
    const [rows] = await pool.query(querysHorarios.getHorariosDia, [dia]);
    return rows;
};

// Obtener el número de día desde el nombre del día
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
            return -1;
    }
};

// Recrear citas según horario
const recrearCitasSegunHorario2 = async (horarios) => {
    try {
        console.log('Generando citas nuevas..........');

        for (let horario of horarios) {
            const dia = obtenerNumeroDia(horario.Dia);
            const dayOfWeek = moment().day(dia);
            const startHour = moment(`2023-01-01 ${horario.HoraInicio}`, 'YYYY-MM-DD HH:mm:ss');
            const endHour = moment(`2023-01-01 ${horario.HoraFin}`, 'YYYY-MM-DD HH:mm:ss');
            const startDate = dayOfWeek.clone().hour(startHour.hour()).minute(startHour.minute());
            const endDate = dayOfWeek.clone().hour(endHour.hour()).minute(endHour.minute());

            let currentDateTime = startDate.clone();

            while (currentDateTime.isBefore(endDate)) {
                const startCita = currentDateTime.format('YYYY-MM-DD HH:mm:ss');
                const endCita = currentDateTime.clone().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

                await addSpecificCita(5, 10, startCita, endCita, '');

                currentDateTime.add(30, 'minutes');
            }
        }

        return { msg: 'Citas recreadas correctamente' };
    } catch (error) {
        console.error('Error al recrear citas según horario:', error);
        throw new Error("Error interno del servidor");
    }
};
