import Image from 'next/image'
import Link from 'next/link'

// Import Commponents & constants
import { Button } from '@/components/ui/button'
import { Doctors } from '@/constants'

// Import Components from LIB
import { getUser } from '@/lib/actions/patient.actions'
import { getAppointment } from '@/lib/actions/appointment.actions'
import { formatDateTime } from '@/lib/utils'

// Import Sentry
import * as Sentry from '@sentry/nextjs'

const Success = async ({
   searchParams,
   params: { userId },
}: SearchParamProps) => {
   const appointmentId = (searchParams?.appointmentId as string) || ''

   // Проверка, что id встречи существует
   if (!appointmentId) {
      return <p>Error: No appointment ID provided.</p>
   }

   const appointment = await getAppointment(appointmentId)

   // Проверка, что встреча была успешно загружена
   if (!appointment) {
      return <p>Error: Appointment not found.</p>
   }

   console.log('Appointment Data:', appointment)

   const doctor = Doctors.find(
      (doctor) => doctor.name === appointment.primaryPhysician
   )

   // Проверка, что врач был найден
   if (!doctor) {
      return <p>Error: Doctor not found.</p>
   }

   const user = await getUser(userId)

   Sentry.metrics.set('user_view_appointment-success', user.name)

   console.log('Appointment ID:', appointmentId)

   return (
      <div className='flex h-screen max-h-screen px-[5%]'>
         <div className='success-img'>
            <Link href='/'>
               <Image
                  src='/assets/icons/logo-full.svg'
                  height={1000}
                  width={1000}
                  alt='logo'
                  className='h-10 w-fit'
               />
            </Link>

            <section className='flex flex-col items-center'>
               <Image
                  src='/assets/gifs/success.gif'
                  height={300}
                  width={280}
                  alt='success'
               />
               <h2 className='header mb-6 max-w-[600px] text-center'>
                  Your{' '}
                  <span className='text-green-500'>appointment request</span>{' '}
                  has been successfully submitted!
               </h2>
               <p>We&apos;ll be in touch shortly to confirm.</p>
            </section>

            <section className='request-details'>
               <p>Requested appointment details: </p>
               <div className='flex items-center gap-3'>
                  <Image
                     src={doctor?.image!}
                     alt='doctor'
                     width={100}
                     height={100}
                     className='size-6'
                  />
                  <p className='whitespace-nowrap'>Dr. {doctor?.name}</p>
               </div>
               <div className='flex gap-2'>
                  <Image
                     src='/assets/icons/calendar.svg'
                     height={24}
                     width={24}
                     alt='calendar'
                  />
                  <p> {formatDateTime(appointment.schedule).dateTime}</p>
               </div>
            </section>

            <Button variant='outline' className='shad-primary-btn' asChild>
               <Link href={`/patients/${userId}/new-appointment`}>
                  New Appointment
               </Link>
            </Button>

            <p className='copyright'>© 2024 CarePluse</p>
         </div>
      </div>
   )
}

export default Success
