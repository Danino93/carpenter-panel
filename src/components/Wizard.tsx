import React, { useState } from 'react'
import { JobInput, JobResult } from '../calculators'
import { Step1ProjectType } from './wizard/Step1ProjectType'
import { Step2BasicInfo } from './wizard/Step2BasicInfo'
import { Step3Dimensions } from './wizard/Step3Dimensions'
import { Step4Material } from './wizard/Step4Material'
import { Step5Features } from './wizard/Step5Features'
import { Step6Labor } from './wizard/Step6Labor'
import { Step7Results } from './wizard/Step7Results'

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7

import { Job } from '../calculators/types'

interface WizardProps {
  initialJob: JobInput
  onJobChange: (job: JobInput) => void
  result: JobResult | null
  isCalculating: boolean
  onCalculate: () => void
  currentJob?: Job
}

export const Wizard: React.FC<WizardProps> = ({
  initialJob,
  onJobChange,
  result,
  isCalculating,
  onCalculate,
  currentJob,
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1)
  const [job, setJob] = useState<JobInput>(initialJob)

  const updateJob = (updates: Partial<JobInput>) => {
    const newJob = { ...job, ...updates }
    setJob(newJob)
    onJobChange(newJob)
  }

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as WizardStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const steps = [
    { number: 1, title: 'סוג עבודה', icon: '🎯' },
    { number: 2, title: 'פרטים בסיסיים', icon: '📝' },
    { number: 3, title: 'מידות', icon: '📏' },
    { number: 4, title: 'חומר', icon: '🪵' },
    { number: 5, title: 'תכונות', icon: '⚙️' },
    { number: 6, title: 'עבודה', icon: '🔨' },
    { number: 7, title: 'תוצאות', icon: '📊' },
  ]

  return (
    <div className="wizard-container">
      {/* Progress Bar */}
      <div className="wizard-progress">
        <div className="wizard-steps">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`wizard-step ${currentStep === step.number ? 'active' : ''} ${
                currentStep > step.number ? 'completed' : ''
              }`}
              onClick={() => currentStep > step.number && goToStep(step.number as WizardStep)}
            >
              <div className="wizard-step-icon">{step.icon}</div>
              <div className="wizard-step-content">
                <div className="wizard-step-number">{step.number}</div>
                <div className="wizard-step-title">{step.title}</div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`wizard-step-connector ${currentStep > step.number ? 'completed' : ''}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="wizard-content">
        {currentStep === 1 && (
          <Step1ProjectType
            value={job}
            onChange={updateJob}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <Step2BasicInfo
            value={job}
            onChange={updateJob}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {currentStep === 3 && (
          <Step3Dimensions
            value={job}
            onChange={updateJob}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {currentStep === 4 && (
          <Step4Material
            value={job}
            onChange={updateJob}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {currentStep === 5 && (
          <Step5Features
            value={job}
            onChange={updateJob}
            onNext={nextStep}
            onPrev={prevStep}
          />
        )}
        {currentStep === 6 && (
          <Step6Labor
            value={job}
            onChange={updateJob}
            onNext={nextStep}
            onPrev={prevStep}
            onCalculate={onCalculate}
            isCalculating={isCalculating}
          />
        )}
        {currentStep === 7 && (
          <Step7Results
            result={result}
            input={job}
            job={currentJob}
            onPrev={prevStep}
            onRecalculate={() => goToStep(6)}
          />
        )}
      </div>
    </div>
  )
}

