import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { type CarouselApi } from "@/components/ui/carousel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export function MedicalFormComponent() {
  const [formData, setFormData] = useState({
    date: "",
    casualtyAge: "",
    casualtySex: "",
    urn: "",
    timeOnScene: "",
    timeOffScene: "",
    timeEMSArrived: "",
    firearmsDeployment: "",
    transport: "",
    transportOther: "",
    hospital: "",
    hospitalOther: "",
    mechanismOfInjury: [] as string[],
    mechanismOfInjuryOther: "",
  })
  const { toast } = useToast()
  const [enableChangeCarousel, setEnableChangeCarousel] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollNext, setCanScrollNext] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      mechanismOfInjury: checked
        ? [...prevData.mechanismOfInjury, value]
        : prevData.mechanismOfInjury.filter((item) => item !== value),
    }))
  }

  const isFormValid = (): boolean => {
    const { 
      date, 
      casualtyAge, 
      casualtySex, 
      urn, 
      timeOnScene, 
      timeOffScene, 
      timeEMSArrived, 
      firearmsDeployment,
      transport, 
      hospital, 
      transportOther, 
      hospitalOther, 
      mechanismOfInjury, 
      mechanismOfInjuryOther 
    } = formData;
    
    const isOtherFieldsFilled = 
      (transport !== "Other" || transportOther.trim() !== "") && 
      (hospital !== "other" || hospitalOther.trim() !== "") && 
      (!mechanismOfInjury.includes("Other") || mechanismOfInjuryOther.trim() !== "");
    
    return !!date && !!casualtyAge && !!casualtySex && !!urn && !!timeOnScene && 
           !!timeOffScene && !!timeEMSArrived && !!transport && !!hospital && 
           isOtherFieldsFilled && mechanismOfInjury.length > 0 && firearmsDeployment !== "";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid()) {
      console.log("Form data:", formData)
      toast({
        title: "Form data saved",
        description: "You can go back and make changes.",
      })
      api?.scrollNext()
    } else {
      toast({
        title: "Form Incomplete",
        description: "Please fill all required fields.",
      })
    }
  }

  useEffect(() => {
    setEnableChangeCarousel(isFormValid())
  }, [formData])

  const onSelect = useCallback(() => {
    if (!api) return
    setCanScrollNext(api.canScrollNext())
  }, [api])

  useEffect(() => {
    if (!api) return

    api.on("select", onSelect)
    // Check initial state
    setCanScrollNext(api.canScrollNext())

    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  const handleChangeCarouselState = useCallback(() => {
    setEnableChangeCarousel((prev) => !prev)
    if (!enableChangeCarousel) {
      setCanScrollNext(true)
    }
  }, [enableChangeCarousel])

  return (
    <div className="flex items-center justify-center">
      <Carousel className="w-full max-w-[60%]" setApi={setApi} opts={{
        watchDrag: enableChangeCarousel,
      }} >
        <CarouselContent>
            <CarouselItem>
              <form onSubmit={handleSubmit}>
              <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-4xl">Patient Report Form</CardTitle>
                  <CardDescription>Please fill out the patient's information accurately.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Casualty Age</Label>
                        <RadioGroup value={formData.casualtyAge} onValueChange={(value) => handleRadioChange("casualtyAge", value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="<18" id="<18" />
                            <Label htmlFor="<18">Less than 18</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value=">18" id=">18" />
                            <Label htmlFor=">18">More than 18</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Casualty Sex</Label>
                        <RadioGroup value={formData.casualtySex} onValueChange={(value) => handleRadioChange("casualtySex", value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="M" id="male" />
                            <Label htmlFor="male">M</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="F" id="female" />
                            <Label htmlFor="female">F</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urn">URN</Label>
                        <Input id="urn" name="urn" value={formData.urn} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeOnScene">Time on Scene</Label>
                        <Input id="timeOnScene" name="timeOnScene" type="time" value={formData.timeOnScene} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeOffScene">Time off Scene</Label>
                        <Input id="timeOffScene" name="timeOffScene" type="time" value={formData.timeOffScene} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeEMSArrived">Time EMS Arrived</Label>
                        <Input id="timeEMSArrived" name="timeEMSArrived" type="time" value={formData.timeEMSArrived} onChange={handleInputChange} required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firearmsDeployment">Firearms Deployment</Label>
                      <Input id="firearmsDeployment" name="firearmsDeployment" value={formData.firearmsDeployment} onChange={handleInputChange} required/>
                    </div>
                    <div className="space-y-2">
                      <Label>Transport</Label>
                      <RadioGroup value={formData.transport} onValueChange={(value) => handleRadioChange("transport", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Land Ambulance" id="landAmbulance" />
                          <Label htmlFor="landAmbulance">Land Ambulance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Air Ambulance" id="airAmbulance" />
                          <Label htmlFor="airAmbulance">Air Ambulance</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Police Vehicle" id="policeVehicle" />
                          <Label htmlFor="policeVehicle">Police Vehicle</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Other" id="otherTransport" />
                          <Label htmlFor="otherTransport">Other</Label>
                        </div>
                      </RadioGroup>
                      {formData.transport === "Other" && (
                        <Input
                          id="transportOther"
                          name="transportOther"
                          value={formData.transportOther}
                          onChange={handleInputChange}
                          placeholder="Please specify"
                          required
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Hospital</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({ ...prev, hospital: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hospital" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hospital1">Hospital 1</SelectItem>
                          <SelectItem value="hospital2">Hospital 2</SelectItem>
                          <SelectItem value="hospital3">Hospital 3</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.hospital === "other" && (
                        <Input
                          id="hospitalOther"
                          name="hospitalOther"
                          value={formData.hospitalOther}
                          onChange={handleInputChange}
                          placeholder="Please specify"
                          required
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Mechanism of Injury</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "Blunt trauma", "Penetrating injury", "Medical", "Mental health",
                          "Stabbing", "Alcohol/drugs", "Vehicle RTC", "Self-harm",
                          "Shooting", "Punched/kicked", "Pedestrian hit by vehicle", "Suicide/parasuicide",
                          "Burn", "Hanging", "Cyclist", "Fall < 6 ft", "Fall >6 ft"
                        ].map((injury) => (
                          <div className="flex items-center space-x-2" key={injury}>
                            <Checkbox
                              id={injury}
                              checked={formData.mechanismOfInjury.includes(injury)}
                              onCheckedChange={(checked) => handleCheckboxChange(injury, checked as boolean)}
                            />
                            <Label htmlFor={injury}>{injury}</Label>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="otherInjury"
                          checked={formData.mechanismOfInjury.includes("Other")}
                          onCheckedChange={(checked) => handleCheckboxChange("Other", checked as boolean)}
                        />
                        <Label htmlFor="otherInjury">Other</Label>
                      </div>
                      {formData.mechanismOfInjury.includes("Other") && (
                        <Input
                          id="mechanismOfInjuryOther"
                          name="mechanismOfInjuryOther"
                          value={formData.mechanismOfInjuryOther}
                          onChange={handleInputChange}
                          placeholder="Please specify"
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={!enableChangeCarousel || !canScrollNext}>Continue</Button>
                </CardFooter>
              </Card>
            </form>
            </CarouselItem>
            <CarouselItem>
              <div>Slide 2</div>
            </CarouselItem>
            
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext disabled={!enableChangeCarousel || !canScrollNext} />
      </Carousel>
    </div>
  )
}