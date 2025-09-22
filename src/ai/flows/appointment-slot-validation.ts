// src/ai/flows/appointment-slot-validation.ts
'use server';

/**
 * @fileOverview Validates requested appointment slots and suggests alternatives using generative AI.
 *
 * - validateAppointmentSlot - A function that validates an appointment slot and suggests alternatives.
 * - ValidateAppointmentSlotInput - The input type for the validateAppointmentSlot function.
 * - ValidateAppointmentSlotOutput - The return type for the validateAppointmentSlot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateAppointmentSlotInputSchema = z.object({
  doctorId: z.string().describe('The ID of the doctor.'),
  patientId: z.string().describe('The ID of the patient.'),
  requestedSlot: z.string().describe('The requested appointment slot (e.g., date and time).'),
  existingAppointments: z
    .string()
    .array()
    .describe('A list of existing appointments for the doctor in the format "date and time".'),
});
export type ValidateAppointmentSlotInput = z.infer<typeof ValidateAppointmentSlotInputSchema>;

const ValidateAppointmentSlotOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the requested appointment slot is valid.'),
  alternativeSlots: z
    .string()
    .array() // Corrected the schema to indicate an array of strings
    .describe('Suggested alternative appointment slots.'),
  reason: z.string().optional().describe('The reason why the slot is invalid, if applicable.'),
});

export type ValidateAppointmentSlotOutput = z.infer<typeof ValidateAppointmentSlotOutputSchema>;

export async function validateAppointmentSlot(
  input: ValidateAppointmentSlotInput
): Promise<ValidateAppointmentSlotOutput> {
  return validateAppointmentSlotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateAppointmentSlotPrompt',
  input: {
    schema: ValidateAppointmentSlotInputSchema,
  },
  output: {
    schema: ValidateAppointmentSlotOutputSchema,
  },
  prompt: `You are an appointment scheduling assistant. A patient wants to book an appointment with a doctor at a specific time.

  Doctor ID: {{{doctorId}}}
  Patient ID: {{{patientId}}}
  Requested Slot: {{{requestedSlot}}}
  Existing Appointments: {{#if existingAppointments.length}}{{#each existingAppointments}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}

  Determine if the requested slot is available. If it is, return isValid as true and an empty array for alternativeSlots.
  If the slot is not available, return isValid as false. Provide a reason why the slot is invalid. Suggest at least 3 alternative appointment slots that are available, taking into consideration typical appointment durations. Return the alternative slots as a string array. Make sure alternative slots are in the future.
  Only return valid JSON. The alternative slots must be in the same format as the requestedSlot. The output should match ValidateAppointmentSlotOutputSchema. Do not make up appointments from the past; only suggest future appointments.
  `,
});

const validateAppointmentSlotFlow = ai.defineFlow(
  {
    name: 'validateAppointmentSlotFlow',
    inputSchema: ValidateAppointmentSlotInputSchema,
    outputSchema: ValidateAppointmentSlotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
