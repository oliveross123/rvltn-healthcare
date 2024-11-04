export const GenderOptions = ["muž", "žena", "jiné"];

export const PatientFormDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  birthDate: new Date(Date.now()),
  gender: "male" as Gender,
  address: "",
  occupation: "",
  emergencyContactName: "",
  emergencyContactNumber: "",
  primaryPhysician: "",
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: "",
  currentMedication: "",
  familyMedicalHistory: "",
  pastMedicalHistory: "",
  identificationType: "Rodný list",
  identificationNumber: "",
  identificationDocument: [],
  treatmentConsent: false,
  disclosureConsent: false,
  privacyConsent: false,
};

export const IdentificationTypes = [
  "Rodný list",
  "Řidičský průkaz",
  "Občanský průkaz",
  "Pas",
];

export const Doctors = [
  {
    image: "/assets/images/dr-green.png",
    name: "MVDr. Marek Novák",
  },
  {
    image: "/assets/images/dr-cameron.png",
    name: "MVDr. Gabriela Zelinková",
  },
  {
    image: "/assets/images/dr-livingston.png",
    name: "MVDr. David Šebesta",
  },
  {
    image: "/assets/images/dr-peter.png",
    name: "MVDr. Ondřej Neplecha",
  },
  {
    image: "/assets/images/dr-powell.png",
    name: "MVDr. Jana Švihlá",
  },
  {
    image: "/assets/images/dr-remirez.png",
    name: "MVDr. Alex Ramirez",
  },
  {
    image: "/assets/images/dr-lee.png",
    name: "MVDr. Jasmine Lee",
  },
  {
    image: "/assets/images/dr-cruz.png",
    name: "MVDr. Alyana Cruz",
  },
  {
    image: "/assets/images/dr-sharma.png",
    name: "MVDr. Hardik Sharma",
  },
];

export const StatusIcon = {
  naplánovat: "/assets/icons/check.svg",
  nevyřízene: "/assets/icons/pending.svg",
  zrušit: "/assets/icons/cancelled.svg",
  vyřešeno: "/assets/icons/check.svg",
};
