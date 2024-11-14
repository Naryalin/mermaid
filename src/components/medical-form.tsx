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
    airwayStatus: "",
    airwayType: [] as string[],
    breathingRate: {
      reading1: "",
      reading2: ""
    },
    circulationRate: "",
    tourniquet: {
        "Right Arm": false,
        "Left Arm": false,
        "Right Leg": false,
        "Left Leg": false
    },
    breathingEffort: "",
    externalBleeding: false,
    bleedingWound: "",
    oxygen: [] as string[],
    oxygenSaturation: {
        reading1: "",
        reading2: ""
    },
    dressing: {
        field: false,
        abdomen: false,
        windlass: false,
        longBones: false
    },
    pelvisFracture: false,
    splint: false,
    softFacialInjury: false,
    flash: false,
    bonyFacialInjury: false,
    holes: {
        front: {
            left: {
                chestSeal: false,
                vented: false,
                nonVented: false
            },
            right: {
                chestSeal: false,
                vented: false,
                nonVented: false
            }
        },
        back: {
            left: {
                chestSeal: false,
                vented: false,
                nonVented: false
            },
            right: {
                chestSeal: false,
                vented: false,
                nonVented: false
            }
        }
    },
    radialPulse: {
        reading1: "",
        reading2: ""
    },
    cSpine: {
        normal: true,
        suspectedInjury: false,
        manualControl: false
    },
    ribFracturesFlail: "",
    noPulse: false,
    cprStatus: "",
    disabilityScore: {
      reading1: "",
      reading2: ""
    },
    exposureForExamination: [] as string[],
    burns: "",
    complainPain: false,
    penthroxUsed: false,
    vialsUsed: "",
    initialPainScore: 0,
    painScoreAfterDose1: {
        score: 0,
        time: "",
        batchNumber: "",
        expiryDate: "",
        administeredBy: ""
    },
    painScoreAfterDose2: {
        score: 0,
        time: "",
        batchNumber: "",
        expiryDate: "",
        administeredBy: ""
    },
    breathingPainRate:"",
    adverseReactionToPenthrox: false,
    penthRoxConfirmation: false,
    radialPainPulse: false,
    handoverEMS: false,
    ADRReported: {
      state: false,
      name: "",
      date: ""
    },
    nameStaff: "",
    alertAndAble: false,
    patientInfo: {
        fullName: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        medicalInsuranceProvider: ""
    },
    emergencyContacts: [
        { primaryContactName: "", relationship: "", phoneNumber: "" },
        { alternateContactName: "", relationship: "", phoneNumber: "" }
    ],
    preferredHospital: "",
    dnrOrders: false,
    consent: {
        treatment: false,
        general: false
    },
    chronicConditions: [
        { condition: "", dateDiagnosed: "", treatmentPlan: "", currentStatus: "" }
    ],
    medicationList: [
        { medicationName: "", dosage: "", route: "", frequency: "", startDate: "", endDate: "", prescribingPhysician: "" }
    ],
    allergyRecord: [
        { allergen: "", reaction: "", severity: "", dateOfReaction: "" }
    ],
    familyMedicalHistory: [
        { relative: "", relationship: "", condition: "", ageOfOnset: "" }
    ],
    symptomTracker: [
        { symptom: "", onsetDate: "", duration: "", severity: 0, associatedConditions: "" }
    ]
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

  const handleNestedInputChange = (category: string, field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [category]: {
        ...((prevData[category as keyof typeof prevData]) as object),
        [field]: value,
      },
    }))
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleMultiSelectChange = (name: string, value: string, checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
        ? [...(prevData[name as keyof typeof prevData] as string[]), value]
        : (prevData[name as keyof typeof prevData] as string[]).filter((item) => item !== value),
    }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: checked
        ? [...prevData[field as keyof typeof formData]  as string[], value]
        : (prevData[field as keyof typeof formData] as string[]).filter((item) => item !== value),
    }))
  }

  const handleNestedCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
  
      if (name.startsWith('tourniquet')) {
        const [_, fieldName] = name.split('.');
        updatedData.tourniquet = {
          ...updatedData.tourniquet,
          [fieldName]: checked,
        };
      } else if(name.startsWith('dressing')){
        const [_, fieldName] = name.split('.');
        updatedData.dressing = {
          ...updatedData.dressing,
          [fieldName]: checked,
        };
      } else if(name.startsWith('cSpine')){
        const [_, fieldName] = name.split('.');
        updatedData.cSpine = {
          ...updatedData.cSpine,
          [fieldName]: checked,
        };
      } else if(name.startsWith('ADRReported')){
        const [_, fieldName] = name.split('.');
        updatedData.ADRReported = {
          ...updatedData.ADRReported,
          [fieldName]: checked,
        };
      } else if (name.startsWith('holes')) {
        const [_, side, direction, type] = name.split('.');
        updatedData.holes = {
          ...updatedData.holes,
          [side]: {
            ...updatedData.holes[side as keyof typeof updatedData.holes],
            [direction]: {
              ...updatedData.holes[side][direction],
              [type]: checked,
            },
          },
        };
      } else {
        updatedData[name] = checked;
      }
  
      return updatedData;
    });
  };
  

  const isFormValid = (): boolean[] => {
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
      mechanismOfInjuryOther,
      airwayStatus,
      airwayType,
      breathingRate,
      breathingEffort,
      circulationRate,
      externalBleeding,
      bleedingWound,
      oxygen,
      oxygenSaturation,
      radialPulse,
      noPulse,
      cprStatus,
      disabilityScore,
      complainPain,
      initialPainScore,
      painScoreAfterDose1,
      painScoreAfterDose2,
      nameStaff
    } = formData;
    
    const isOtherFieldsFilled = 
      (transport !== "Other" || transportOther.trim() !== "") && 
      (hospital !== "other" || hospitalOther.trim() !== "") && 
      (!mechanismOfInjury.includes("Other") || mechanismOfInjuryOther.trim() !== "");
    
      const stage1Valid = !!date && !!casualtyAge && !!casualtySex && !!urn && !!timeOnScene && 
      !!timeOffScene && !!timeEMSArrived && !!transport && !!hospital && 
      isOtherFieldsFilled && mechanismOfInjury.length > 0 && firearmsDeployment !== "";

      //Second stage: Airway, Breathing, and Circulation
      const stage2Valid = !!airwayStatus && (airwayType.length > 0 || airwayStatus === "Clear") &&
            !!breathingRate.reading1 && !!breathingRate.reading2 && 
            !!breathingEffort && !!circulationRate && ((externalBleeding=== true && !!bleedingWound) || externalBleeding===false) &&
            oxygen.length>0 && !!oxygenSaturation.reading1 && !!oxygenSaturation.reading2 && !!radialPulse.reading1 && !!radialPulse.reading2 && ((noPulse === true && !!cprStatus) || noPulse===false) &&
            !!disabilityScore.reading1 && !!disabilityScore.reading2 &&
            ((complainPain === true && !!initialPainScore && !!painScoreAfterDose1.administeredBy && !!painScoreAfterDose1.batchNumber &&
            !!painScoreAfterDose1.expiryDate && !!painScoreAfterDose1.score && !!painScoreAfterDose2.administeredBy && !!painScoreAfterDose2.batchNumber &&
            !!painScoreAfterDose2.expiryDate && !!painScoreAfterDose2.score
            ) || complainPain === false) && !!nameStaff;

      return [stage1Valid, stage2Valid];
  }

  const handleSubmit = (e: React.FormEvent) => {
    let currentLocation = api?.selectedScrollSnap()
    e.preventDefault()
    if(currentLocation != null){
      if (isFormValid()[currentLocation]) {
        console.log("Form data:", formData)
        toast({
          title: "Form data saved",
          description: "You can go back and make changes.",
        })
        if(api && currentLocation+1 < api?.scrollSnapList().length){
          api?.scrollNext();
        } else {
          fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),  // Envía el formData como JSON
          })
            .then(response => response.text())
            .then(data => {
              console.log('Data saved:', data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
        currentLocation = api?.selectedScrollSnap()
        if(currentLocation != null){
          setEnableChangeCarousel(isFormValid()[currentLocation])
        }
        
      } else {
        toast({
          title: "Form Incomplete",
          description: "Please fill all required fields.",
        })
      }
    }
  }

  useEffect(() => {
    const currentLocation = api?.selectedScrollSnap()
    if(currentLocation != null){
      setEnableChangeCarousel(isFormValid()[currentLocation])
    }
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
                                onCheckedChange={(checked) => handleCheckboxChange("mechanismOfInjury", injury, checked as boolean)}
                              />
                              <Label htmlFor={injury}>{injury}</Label>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="otherInjury"
                            checked={formData.mechanismOfInjury.includes("Other")}
                            onCheckedChange={(checked) => handleCheckboxChange("mechanismOfInjury", "Other", checked as boolean)}
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
              <form>
                <Card>
                  <CardHeader>
                    <CardTitle>Airway, Breathing & Circulation</CardTitle>
                    <CardDescription>Assess the patient's airway and breathing status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Airway Status</Label>
                      <RadioGroup value={formData.airwayStatus} onValueChange={(value) => handleRadioChange("airwayStatus", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Clear" id="clear" />
                          <Label htmlFor="clear">Clear</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Obstructed Snoring" id="Obstructed Snoring" />
                          <Label htmlFor="Obstructed Snoring">Obstructed Snoring</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Obstructed Gurgling" id="Obstructed Gurgling" />
                          <Label htmlFor="Obstructed Gurgling">Obstructed Gurgling</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Complete Obstruction" id="Complete Obstruction" />
                          <Label htmlFor="Complete Obstruction">Complete Obstruction</Label>
                        </div>
                      </RadioGroup>
                    </div>
                      {formData.airwayStatus === "Obstructed Snoring" && (
                        <div className="space-y-2">
                          <Label>Obstructed Snoring Type</Label>
                          {["Patient position", "Chin lift", "Jaw thrust", "NP", "OP", "SGA"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={formData.airwayType.includes(type)}
                                onCheckedChange={(checked) => handleCheckboxChange("airwayType", type, checked as boolean)}
                              />
                              <Label htmlFor={type}>{type}</Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {formData.airwayStatus === "Obstructed Gurgling" && (
                        <div className="space-y-2">
                          <Label>Obstructed Gurgling Type</Label>
                          {["Patient turned", "Suction"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={formData.airwayType.includes(type)}
                                onCheckedChange={(checked) => handleCheckboxChange("airwayType", type, checked as boolean)}
                              />
                              <Label htmlFor={type}>{type}</Label>
                            </div>
                          ))}
                        </div>
                      )}

                      {formData.airwayStatus === "Complete Obstruction" && (
                        <div className="space-y-2">
                          <Label>Complete Obstruction Type</Label>
                          {["Back blows", "Abdominal/chest thrusts"].map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={formData.airwayType.includes(type)}
                                onCheckedChange={(checked) => handleCheckboxChange("airwayType", type, checked as boolean)}
                              />
                              <Label htmlFor={type}>{type}</Label>
                            </div>
                          ))}
                        </div>
                      )}
                    <div className="space-y-2">
                      <Label>Breathing Rate</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="breathingRate1">Reading 1</Label>
                          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, breathingRate: { ...prev.breathingRate, reading1: value } }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<10">&lt;10</SelectItem>
                              <SelectItem value="10-30">10 - 30</SelectItem>
                              <SelectItem value=">30">&gt;30</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="breathingRate2">Reading 2</Label>
                          <Select onValueChange={(value) => setFormData(prev => ({ ...prev, breathingRate: { ...prev.breathingRate, reading2: value } }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<10">&lt;10</SelectItem>
                              <SelectItem value="10-30">10 - 30</SelectItem>
                              <SelectItem value=">30">&gt;30</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Breathing Effort</Label>
                      <RadioGroup value={formData.breathingEffort} onValueChange={(value) => handleRadioChange("breathingEffort", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Normal" id="normalEffort" />
                          <Label htmlFor="normalEffort">Normal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Abnormal" id="abnormalEffort" />
                          <Label htmlFor="abnormalEffort">Abnormal</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>Circulation Rate</Label>
                      <Select onValueChange={(value) => handleRadioChange("circulationRate", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<60">&lt;60</SelectItem>
                          <SelectItem value="60-120">60 - 120</SelectItem>
                          <SelectItem value=">120">&gt;120</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tourniquet</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(formData.tourniquet).map(([key, value]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={value}
                              onCheckedChange={(checked) => handleNestedCheckboxChange(`tourniquet.${key}`, checked as boolean)}
                            />
                            <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>External Bleeding</Label>
                      <Checkbox
                        id="externalBleeding"
                        checked={formData.externalBleeding}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("externalBleeding", checked as boolean)}
                      />
                    </div>
                    {formData.externalBleeding && (
                      <div className="space-y-2">
                        <Label htmlFor="bleedingWound">Bleeding Wound</Label>
                        <Input
                          id="bleedingWound"
                          name="bleedingWound"
                          value={formData.bleedingWound}
                          onChange={handleInputChange}
                          placeholder="Describe the bleeding wound"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Oxygen</Label>
                      {["High flow mask", "BVM"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.oxygen.includes(type)}
                            onCheckedChange={(checked) => handleMultiSelectChange("oxygen", type, checked as boolean)}
                          />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Oxygen Saturation</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="oxygenSaturation1">Reading 1</Label>
                          <Select onValueChange={(value) => handleNestedInputChange("oxygenSaturation", "reading1", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select saturation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<95">&lt;95</SelectItem>
                              <SelectItem value=">95">&gt;95</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="oxygenSaturation2">Reading 2</Label>
                          <Select onValueChange={(value) => handleNestedInputChange("oxygenSaturation", "reading2", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select saturation" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<95">&lt;95</SelectItem>
                              <SelectItem value=">95">&gt;95</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Dressing</Label>
                      {Object.entries(formData.dressing).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) => handleNestedCheckboxChange(`dressing.${key}`, checked as boolean)}
                          />
                          <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Pelvis/Femur Fracture</Label>
                      <Checkbox
                        id="pelvisFracture"
                        checked={formData.pelvisFracture}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("pelvisFracture", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Splint</Label>
                      <Checkbox
                        id="splint"
                        checked={formData.splint}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("splint", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Soft Facial Injury</Label>
                      <Checkbox
                        id="softFacialInjury"
                        checked={formData.softFacialInjury}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("softFacialInjury", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>FLASH</Label>
                      <Checkbox
                        id="flash"
                        checked={formData.flash}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("flash", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bony Facial Injury</Label>
                      <Checkbox
                        id="bonyFacialInjury"
                        checked={formData.bonyFacialInjury}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("bonyFacialInjury", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Holes</Label>
                      {['front', 'back'].map((side) => (
                        <div key={side} className="space-y-2">
                          <Label>{side.charAt(0).toUpperCase() + side.slice(1)}</Label>
                          {['left', 'right'].map((direction) => (
                            <div key={`${side}-${direction}`} className="space-y-1">
                              <Label>{direction.charAt(0).toUpperCase() + direction.slice(1)}</Label>
                              {['chestSeal', 'vented', 'nonVented'].map((type) => (
                                <div key={`${side}-${direction}-${type}`} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${side}-${direction}-${type}`}
                                    checked={(formData.holes as { [key: string]: any })[side][direction][type]}
                                    onCheckedChange={(checked) => handleNestedCheckboxChange(`holes.${side}.${direction}.${type}`, checked as boolean)}
                                  />
                                  <Label htmlFor={`${side}-${direction}-${type}`}>{type.replace(/([A-Z])/g, ' $1').trim()}</Label>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Radial Pulse</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="radialPulse1">Reading 1</Label>
                          <Select onValueChange={(value) => handleNestedInputChange("radialPulse", "reading1", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pulse rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<60">&lt;60</SelectItem>
                              <SelectItem value="60-120">60 - 120</SelectItem>
                              <SelectItem value=">120">&gt;120</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="radialPulse2">Reading 2</Label>
                          <Select onValueChange={(value) => handleNestedInputChange("radialPulse", "reading2", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pulse rate" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<60">&lt;60</SelectItem>
                              <SelectItem value="60-120">60 - 120</SelectItem>
                              <SelectItem value=">120">&gt;120</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>C-Spine</Label>
                      {Object.entries(formData.cSpine).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`cSpine-${key}`}
                            checked={value}
                            onCheckedChange={(checked) => handleNestedCheckboxChange(`cSpine.${key}`, checked as boolean)}
                          />
                          <Label htmlFor={`cSpine-${key}`}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ribFracturesFlail">Rib Fractures/Flail Chest</Label>
                      <Input
                        id="ribFracturesFlail"
                        name="ribFracturesFlail"
                        value={formData.ribFracturesFlail}
                        onChange={handleInputChange}
                        placeholder="Describe rib fractures or flail chest"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>No Pulse</Label>
                      <Checkbox
                        id="noPulse"
                        checked={formData.noPulse}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("noPulse", checked as boolean)}
                      />
                    </div>
                    {formData.noPulse && (
                      <div className="space-y-2">
                        <Label htmlFor="cprStatus">CPR Status</Label>
                        <Input
                          id="cprStatus"
                          name="cprStatus"
                          value={formData.cprStatus}
                          onChange={handleInputChange}
                          placeholder="Describe CPR status"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Disability Score</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="disabilityScore1">Reading 1</Label>
                          <Select onValueChange={(value) => handleNestedInputChange("disabilityScore", "reading1", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select score" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A (Alert)</SelectItem>
                              <SelectItem value="V">V (Voice)</SelectItem>
                              <SelectItem value="P">P (Pain)</SelectItem>
                              <SelectItem value="U">U (Unresponsive)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="disabilityScore2">Reading 2</Label>
                          <Select onValueChange={(value) => handleNestedInputChange("disabilityScore", "reading2", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select score" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A (Alert)</SelectItem>
                              <SelectItem value="V">V (Voice)</SelectItem>
                              <SelectItem value="P">P (Pain)</SelectItem>
                              <SelectItem value="U">U (Unresponsive)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Exposure for Examination</Label>
                      {["Fully undressed", "Logroll", "Back & sides check"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.exposureForExamination.includes(type)}
                            onCheckedChange={(checked) => handleMultiSelectChange("exposureForExamination", type, checked as boolean)}
                          />
                          <Label htmlFor={type}>{type}</Label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="burns">Burns</Label>
                      <Select onValueChange={(value) => handleRadioChange("burns", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select burns treatment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10 mins irrigation">10 mins irrigation</SelectItem>
                          <SelectItem value="10 - 20 mins irrigation">10 - 20 mins irrigation</SelectItem>
                          <SelectItem value="Clingfilm">Clingfilm</SelectItem>
                          <SelectItem value="Diphoterine">Diphoterine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Patient complaining of pain?</Label>
                      <Checkbox
                        id="complainPain"
                        checked={formData.complainPain}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("complainPain", checked as boolean)}
                      />
                    </div>
                    {formData.complainPain && (
                      <>
                        <div className="space-y-2">
                          <Label>Penthrox used</Label>
                          <Checkbox
                            id="penthroxUsed"
                            checked={formData.penthroxUsed}
                            onCheckedChange={(checked) => handleNestedCheckboxChange("penthroxUsed", checked as boolean)}
                          />
                        </div>
                        {formData.penthroxUsed && (
                          <div className="space-y-2">
                            <Label htmlFor="vialsUsed">Number of vials used</Label>
                            <Input
                              id="vialsUsed"
                              name="vialsUsed"
                              type="number"
                              value={formData.vialsUsed}
                              onChange={handleInputChange}
                              min="1"
                              max="2"
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Initial Pain Score</Label>
                          <Input
                            type="range"
                            min="0"
                            max="10"
                            value={formData.initialPainScore}
                            onChange={(e) => handleRadioChange("initialPainScore", e.target.value)}
                          />
                          <div className="text-center">{formData.initialPainScore}</div>
                        </div>
                        {['painScoreAfterDose1', 'painScoreAfterDose2'].map((dose, index) => (
                          <div key={dose} className="space-y-2">
                            <Label>{`Pain Score after dose ${index + 1}`}</Label>
                            <Input
                              type="range"
                              min="0"
                              max="10"
                              value={formData[dose as keyof typeof formData].score}
                              onChange={(e) => handleNestedInputChange(dose, "score", e.target.value)}
                            />
                            <div className="text-center">{formData[dose as keyof typeof formData].score}</div>
                            <Input
                              placeholder="Time"
                              value={formData[dose as keyof typeof formData].time}
                              onChange={(e) => handleNestedInputChange(dose, "time", e.target.value)}
                            />
                            <Input
                              placeholder="Batch Number"
                              value={formData[dose as keyof typeof formData]?.batchNumber}
                              onChange={(e) => handleNestedInputChange(dose, "batchNumber", e.target.value)}
                            />
                            <Input
                              placeholder="Expiry Date"
                              type="date"
                              value={formData[dose as keyof typeof formData].expiryDate}
                              onChange={(e) => handleNestedInputChange(dose, "expiryDate", e.target.value)}
                            />
                            <Input
                              placeholder="Administered By"
                              value={formData[dose as keyof typeof formData]?.administeredBy}
                              onChange={(e) => handleNestedInputChange(dose, "administeredBy", e.target.value)}
                            />
                          </div>
                        ))}
                      </>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="breathingPainRate">Breathing Pain Rate</Label>
                      <Input
                        id="breathingPainRate"
                        name="breathingPainRate"
                        value={formData.breathingPainRate}
                        onChange={handleInputChange}
                        placeholder="Enter breathing pain rate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Adverse Reaction to Penthrox</Label>
                      <Checkbox
                        id="adverseReactionToPenthrox"
                        checked={formData.adverseReactionToPenthrox}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("adverseReactionToPenthrox", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Penthrox Confirmation</Label>
                      <Checkbox
                        id="penthRoxConfirmation"
                        checked={formData.penthRoxConfirmation}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("penthRoxConfirmation", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Radial Pain Pulse</Label>
                      <Checkbox
                        id="radialPainPulse"
                        checked={formData.radialPainPulse}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("radialPainPulse", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Handover to EMS</Label>
                      <Checkbox
                        id="handoverEMS"
                        checked={formData.handoverEMS}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("handoverEMS", checked as boolean)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>ADRs Reported</Label>
                      <Checkbox
                        id="ADRReported"
                        checked={formData.ADRReported.state}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("ADRReported.state", checked as boolean)}
                      />
                      {formData.ADRReported.state && (
                        <>
                          <Input
                            placeholder="Name"
                            value={formData.ADRReported.name}
                            onChange={(e) => handleNestedInputChange("ADRReported", "name", e.target.value)}
                          />
                          <Input
                            type="date"
                            placeholder="Date"
                            value={formData.ADRReported.date}
                            onChange={(e) => handleNestedInputChange("ADRReported", "date", e.target.value)}
                          />
                        </>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nameStaff">Name of Staff</Label>
                      <Input
                        id="nameStaff"
                        name="nameStaff"
                        value={formData.nameStaff}
                        onChange={handleInputChange}
                        placeholder="Enter staff name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Alert and Able to Obey Commands</Label>
                      <Checkbox
                        id="alertAndAble"
                        checked={formData.alertAndAble}
                        onCheckedChange={(checked) => handleNestedCheckboxChange("alertAndAble", checked as boolean)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={!enableChangeCarousel} onClick={handleSubmit}>
                      {api && api.scrollSnapList().length === api.selectedScrollSnap() + 1 ? "Submit" : "Continue"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </CarouselItem>
            
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext disabled={!enableChangeCarousel || !canScrollNext} onClick={handleSubmit}/>
      </Carousel>
    </div>
  )
}