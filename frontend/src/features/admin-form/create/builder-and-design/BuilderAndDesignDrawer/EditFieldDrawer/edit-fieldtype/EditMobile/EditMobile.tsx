import { useMemo } from 'react'
import { Box, FormControl } from '@chakra-ui/react'
import { extend, pick } from 'lodash'

import { MobileFieldBase } from '~shared/types/field'

import { createBaseValidationRules } from '~utils/fieldValidation'
import FormErrorMessage from '~components/FormControl/FormErrorMessage'
import FormLabel from '~components/FormControl/FormLabel'
import Input from '~components/Input'
import Textarea from '~components/Textarea'
import Toggle from '~components/Toggle'

import { useFreeSmsQuota } from '~features/admin-form/common/queries'

import { CreatePageDrawerContentContainer } from '../../../../../common'
import { FormFieldDrawerActions } from '../common/FormFieldDrawerActions'
import { EditFieldProps } from '../common/types'
import { useEditFieldForm } from '../common/useEditFieldForm'

import { SmsCountMessage } from './SmsCountMessage'

const EDIT_MOBILE_KEYS = [
  'title',
  'description',
  'required',
  'isVerifiable',
  'allowIntlNumbers',
] as const

type EditMobileProps = EditFieldProps<MobileFieldBase>

type EditMobileInputs = Pick<MobileFieldBase, (typeof EDIT_MOBILE_KEYS)[number]>

export const EditMobile = ({ field }: EditMobileProps): JSX.Element => {
  const {
    register,
    formState: { errors },
    buttonText,
    handleUpdateField,
    isLoading,
    handleCancel,
  } = useEditFieldForm<EditMobileInputs, MobileFieldBase>({
    field,
    transform: {
      input: (inputField) => pick(inputField, EDIT_MOBILE_KEYS),
      output: (formOutput, originalField) =>
        extend({}, originalField, formOutput),
    },
  })

  const requiredValidationRule = useMemo(
    () => createBaseValidationRules({ required: true }),
    [],
  )

  const { data: freeSmsCount } = useFreeSmsQuota()

  return (
    <>
      <CreatePageDrawerContentContainer>
        <FormControl
          isRequired
          isReadOnly={isLoading}
          isInvalid={!!errors.title}
        >
          <FormLabel>Question</FormLabel>
          <Input autoFocus {...register('title', requiredValidationRule)} />
          <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isReadOnly={isLoading}
          isInvalid={!!errors.description}
        >
          <FormLabel>Description</FormLabel>
          <Textarea {...register('description')} />
          <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isReadOnly={isLoading}>
          <Toggle {...register('required')} label="Required" />
        </FormControl>
        <FormControl isReadOnly={isLoading}>
          <Toggle
            {...register('allowIntlNumbers')}
            label="Allow international numbers"
          />
        </FormControl>
        <Box>
          <FormControl isReadOnly={isLoading}>
            <Toggle
              {...register('isVerifiable')}
              label="OTP verification"
              description="Respondents must verify by entering a code sent to them. If you have added Twilio credentials, please test this OTP verification feature to make sure your credentials are accurate."
            />
          </FormControl>
          <SmsCountMessage freeSmsCount={freeSmsCount} />
        </Box>
        <FormFieldDrawerActions
          isLoading={isLoading}
          buttonText={buttonText}
          handleClick={handleUpdateField}
          handleCancel={handleCancel}
        />
      </CreatePageDrawerContentContainer>
    </>
  )
}
