import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvatarPreview } from '@/components/partner/AvatarPreview';
import { FeaturePicker } from '@/components/partner/FeaturePicker';
import { VoiceSelect } from '@/components/partner/VoiceSelect';
import { usePartnerCustomization } from '@/hooks/usePartnerCustomization';

export default function PartnerCustomizationScreen() {
  const {
    selections,
    voice,
    setVoice,
    activeFeature,
    setActiveFeature,
    isSubmitting,
    selectFeature,
    handleContinue,
  } = usePartnerCustomization();

  return (
    <div className="dark min-h-screen bg-background text-foreground p-6 md:p-10 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center space-y-1 pb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Create your Language Buddy
            </h1>
            <p className="text-sm text-muted-foreground">
              Your language buddy will roleplay conversations and give you helpful advice
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-4 md:gap-6 items-start">
              <div className="w-28 md:w-40 shrink-0">
                <AvatarPreview selections={selections} />
              </div>
              <div className="flex-1 min-w-0">
                <FeaturePicker
                  selections={selections}
                  activeFeature={activeFeature}
                  onActivate={setActiveFeature}
                  onSelect={selectFeature}
                />
              </div>
            </div>

            <VoiceSelect value={voice} onChange={setVoice} />
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              onClick={handleContinue}
              disabled={isSubmitting}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
