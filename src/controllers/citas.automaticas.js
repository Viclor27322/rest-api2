/* import cron from 'node-cron';
import moment from 'moment';
import { addNewCita } from './citasController';

// Define la tarea programada para generar citas automáticamente cada día de la semana a las 8 am
const generarCitasAutomaticamente = cron.schedule('0 8 * * 1-5', async () => {
  try {
    console.log('Generando citas automáticamente...');

    // Iterar sobre cada día de la semana
    for (let i = 1; i <= 5; i++) { // Lunes (1) a Viernes (5)
      // Obtener el día actual de la semana
      const today = moment().day(i);

      // Iterar sobre el rango de tiempo de 5pm a 8pm en intervalos de 30 minutos
      for (let j = 0; j <= 12; j++) {
        // Calcular la hora de inicio y fin para la cita
        const startHour = today.clone().hour(17).minute(0).add(j * 30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        const endHour = today.clone().hour(17).minute(30).add(j * 30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        // Crear la cita con los parámetros proporcionados
        await addNewCita({
          IdUser: 1, // Id de usuario, ajustar según tus necesidades
          idPaciente: 2, // Id de paciente
          HorarioInicio: startHour,
          HoraFin: endHour,
          Descripcion: '', // Descripción vacía
        });
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
 */