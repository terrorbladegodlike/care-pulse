'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Import Components from UI
import { Form } from '@/components/ui/form'

// Import Components
import CustomFromField from '../CustomFromField'
import SubmitButton from '../SubmitButton'

// Import UseState from React
import { useState } from 'react'

// Import Validation from Lib
import { UserFormValidation } from '@/lib/validation'

// Import UseRouter from Next
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'

export enum FormFieldType {
   INPUT = 'input',
   TEXTAREA = 'textarea',
   PHONE_INPUT = 'phoneInput',
   CHECKBOX = 'checkbox',
   DATE_PICKER = 'datePicker',
   SELECT = 'select',
   SKELETON = 'skeleton',
}

const PatientForm = () => {
   const router = useRouter()

   const [isLoading, setIsLoading] = useState(false)

   const form = useForm<z.infer<typeof UserFormValidation>>({
      resolver: zodResolver(UserFormValidation),
      defaultValues: {
         name: '',
         email: '',
         phone: '',
      },
   })

   async function onSubmit({
      name,
      email,
      phone,
   }: z.infer<typeof UserFormValidation>) {
      setIsLoading(true)

      try {
         const userData = { name, email, phone }

         const user = await createUser(userData)

         if (user) router.push(`/patients/${user.$id}/register`)
      } catch (error) {
         console.log(error)
      }

      setIsLoading(false)
   }

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6 flex-1'
         >
            <section className='mb-12 space-y-4'>
               <h1 className='header'>Hi There 👋</h1>
               <p className='text-dark-700'>Schedule your first appointment.</p>
            </section>

            <CustomFromField
               control={form.control}
               fieldType={FormFieldType.INPUT}
               name='name'
               label='Full name'
               placeholder='Mihail Ternovetchii'
               iconSrc='/assets/icons/user.svg'
               iconAlt='user'
            />

            <CustomFromField
               control={form.control}
               fieldType={FormFieldType.INPUT}
               name='email'
               label='Email'
               placeholder='ternovetchii.2002@gmail.com'
               iconSrc='/assets/icons/email.svg'
               iconAlt='email'
            />

            <CustomFromField
               control={form.control}
               fieldType={FormFieldType.PHONE_INPUT}
               name='phone'
               label='Phone Number'
               placeholder='0 (22) 00-80-00'
            />

            <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
         </form>
      </Form>
   )
}

export default PatientForm
