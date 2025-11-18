"use client";

import { useState } from "react";
import { StepWrapper } from "@/components/StepWrapper";
import { Step1GenomeInput } from "@/components/steps/Step1GenomeInput";
import { Step2JobSelection } from "@/components/steps/Step2JobSelection";
import { Step3Summary } from "@/components/steps/Step3Summary";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [genome, setGenome] = useState("");
  const [selectedJob, setSelectedJob] = useState<string | undefined>();
  const [isLoadingGenome, setIsLoadingGenome] = useState(false);
  const [genomeError, setGenomeError] = useState<string | null>(null);

  const handleContinue = async () => {
    // If we're on step 1, fetch genome data before proceeding
    if (currentStep === 1) {
      if (!genome.trim()) {
        setGenomeError("Please enter a username");
        return;
      }

      setIsLoadingGenome(true);
      setGenomeError(null);

      try {
        const response = await fetch(`/api/genome/${genome}`);
        
        if (response.status === 404) {
          setGenomeError("Genome not found. Please check the username and try again.");
          setIsLoadingGenome(false);
          return;
        }

        if (!response.ok) {
          const data = await response.json();
          setGenomeError(data.error || "Failed to fetch genome data. Please try again.");
          setIsLoadingGenome(false);
          return;
        }

        // Success - proceed to next step
        setGenomeError(null);
        setCurrentStep(currentStep + 1);
      } catch (error) {
        setGenomeError("An error occurred while fetching genome data. Please try again.");
      } finally {
        setIsLoadingGenome(false);
      }
    } else if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      // Last step: reset all data and go to step 0
      setGenome("");
      setSelectedJob(undefined);
      setCurrentStep(0);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    {
      title: "Welcome",
      description: "Get started with your personalized job application journey.",
      component: <div />,
      continueButtonText: "Start",
      showBack: false,
    },
    {
      title: "Input your genome",
      description: "Enter your genome information to get started.",
      component: (
        <Step1GenomeInput
          onGenomeChange={setGenome}
          initialValue={genome}
          error={genomeError}
          onErrorClear={() => setGenomeError(null)}
        />
      ),
    },
    {
      title: "Select the job",
      description: "Choose the job position you're interested in.",
      component: (
        <Step2JobSelection
          onJobSelect={setSelectedJob}
          initialSelected={selectedJob}
          username={genome}
        />
      ),
    },
    {
      title: "Generate summary",
      description: "Review your personalized summary based on your inputs.",
      component: <Step3Summary genome={genome} selectedJob={selectedJob} />,
      showContinue: false,
      backButtonText: "Start Over",
    },
  ];

  const currentStepData = steps[currentStep];

  return (
    <div className="px-8 py-6">
      <StepWrapper
        title={currentStepData.title}
        description={currentStepData.description}
        onContinue={handleContinue}
        onBack={handleBack}
        showContinue={currentStepData.showContinue !== false}
        showBack={
          currentStepData.showBack !== undefined
            ? currentStepData.showBack
            : currentStep > 0
        }
        continueButtonText={currentStepData.continueButtonText}
        backButtonText={currentStepData.backButtonText}
        isLoading={isLoadingGenome && currentStep === 1}
      >
        {currentStepData.component}
      </StepWrapper>
    </div>
  );
}
