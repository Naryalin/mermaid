const doGet = () =>{
  HtmlService.createHtmlOutputFromFile('dist/index.html')
    .evaluate();
}
function doPost(e) {
  const formData = JSON.parse(e.postData.contents);
  saveFormData(formData);
  return ContentService.createTextOutput("Data saved successfully.");
}

function saveFormData(formData) {
  const sheet = SpreadsheetApp.openById("1zXwwqKawDPbIu9SC_wby5NpDv7F07KrcYkrB7miCT6A");
  const dataSheet = sheet.getSheetByName("Form Data");

  // Save data as a new row
  dataSheet.appendRow([
    formData.date,
    formData.casualtyAge,
    formData.casualtySex,
    formData.urn,
    formData.timeOnScene,
    formData.timeOffScene,
    formData.timeEMSArrived,
    formData.firearmsDeployment,
    formData.transport,
    formData.transportOther,
    formData.hospital,
    formData.hospitalOther,
    formData.mechanismOfInjury.join(", "),
    formData.mechanismOfInjuryOther,
    formData.airwayStatus,
    formData.airwayType.join(", "),
    formData.breathingRate.reading1,
    formData.breathingRate.reading2,
    formData.circulationRate,
    formData.tourniquet["Right Arm"],
    formData.tourniquet["Left Arm"],
    formData.tourniquet["Right Leg"],
    formData.tourniquet["Left Leg"],
    formData.breathingEffort,
    formData.externalBleeding,
    formData.bleedingWound,
    formData.oxygen.join(", "),
    formData.oxygenSaturation.reading1,
    formData.oxygenSaturation.reading2,
    formData.dressing.field,
    formData.dressing.abdomen,
    formData.dressing.windlass,
    formData.dressing.longBones,
    formData.pelvisFracture,
    formData.splint,
    formData.softFacialInjury,
    formData.flash,
    formData.bonyFacialInjury,
    formData.holes.front.left.chestSeal,
    formData.holes.front.left.vented,
    formData.holes.front.left.nonVented,
    formData.holes.front.right.chestSeal,
    formData.holes.front.right.vented,
    formData.holes.front.right.nonVented,
    formData.holes.back.left.chestSeal,
    formData.holes.back.left.vented,
    formData.holes.back.left.nonVented,
    formData.holes.back.right.chestSeal,
    formData.holes.back.right.vented,
    formData.holes.back.right.nonVented,
    formData.radialPulse.reading1,
    formData.radialPulse.reading2,
    formData.cSpine.normal,
    formData.cSpine.suspectedInjury,
    formData.cSpine.manualControl,
    formData.ribFracturesFlail,
    formData.noPulse,
    formData.cprStatus,
    formData.disabilityScore.reading1,
    formData.disabilityScore.reading2,
    formData.exposureForExamination.join(", "),
    formData.burns,
    formData.complainPain,
    formData.penthroxUsed,
    formData.vialsUsed,
    formData.initialPainScore,
    formData.painScoreAfterDose1.score,
    formData.painScoreAfterDose1.time,
    formData.painScoreAfterDose1.batchNumber,
    formData.painScoreAfterDose1.expiryDate,
    formData.painScoreAfterDose1.administeredBy,
    formData.painScoreAfterDose2.score,
    formData.painScoreAfterDose2.time,
    formData.painScoreAfterDose2.batchNumber,
    formData.painScoreAfterDose2.expiryDate,
    formData.painScoreAfterDose2.administeredBy,
    formData.breathingPainRate,
    formData.adverseReactionToPenthrox,
    formData.penthRoxConfirmation,
    formData.radialPainPulse,
    formData.handoverEMS,
    formData.ADRReported.state,
    formData.ADRReported.name,
    formData.ADRReported.date,
    formData.nameStaff,
    formData.alertAndAble,
    formData.patientInfo.fullName,
    formData.patientInfo.gender,
    formData.patientInfo.dateOfBirth,
    formData.patientInfo.address,
    formData.patientInfo.medicalInsuranceProvider,
    JSON.stringify(formData.emergencyContacts),
    formData.preferredHospital,
    formData.dnrOrders,
    formData.consent.treatment,
    formData.consent.general,
    JSON.stringify(formData.chronicConditions),
    JSON.stringify(formData.medicationList),
    JSON.stringify(formData.allergyRecord),
    JSON.stringify(formData.familyMedicalHistory),
    JSON.stringify(formData.symptomTracker)
  ]);
}
