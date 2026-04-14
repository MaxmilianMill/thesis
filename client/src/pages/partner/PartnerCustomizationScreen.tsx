import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AvatarPreview } from '@/components/partner/AvatarPreview';
import { FeaturePicker } from '@/components/partner/FeaturePicker';
import { OptionDrawer } from '@/components/partner/OptionDrawer';
import { VoiceSelect } from '@/components/partner/VoiceSelect';
import { usePartnerCustomization } from '@/hooks/usePartnerCustomization';

export default function PartnerCustomizationScreen() {
  const {
    selections,
    voice,
    setVoice,
    openDrawer,
    isSubmitting,
    selectFeature,
    openFeatureDrawer,
    closeDrawer,
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

          <CardContent className="space-y-6">
            <AvatarPreview selections={selections} />

            <FeaturePicker selections={selections} onOpen={openFeatureDrawer} />

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

      <OptionDrawer
        feature={openDrawer}
        selectedId={openDrawer ? selections[openDrawer] : null}
        onSelect={selectFeature}
        onClose={closeDrawer}
      />
    </div>
  );
}
