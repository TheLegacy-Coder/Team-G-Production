export const JobAssignments = {
  Flowers: ["Florist"],
  Religious: ["Priest"],
  Sanitation: ["Janitor"],
  Interpreter: ["Spanish Translator", "Mandarin Translator"],
  Transport: ["Driver", "Pilot"],
};

export interface ServiceRequest {
  requestID: string;
  requestType:
    | "Flowers"
    | "Religious"
    | "Sanitation"
    | "Interpreter"
    | "Transport";
  location: string;
  status: "Assigned" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High" | "Emergency";
  requester: string;
  helpingEmployee?: string | null;
  desc: string;
  time?: string;
}

export interface ServiceRequestFlowers extends ServiceRequest {
  flowerType: "Roses" | "Daisies" | "Orchids" | "Tulips";
  amount: number;
}

export interface ServiceRequestReligious extends ServiceRequest {
  faith: string;
}

export interface ServiceRequestSanitation extends ServiceRequest {
  hazardous: boolean;
  messType: "Vomit" | "Blood" | "Excrement" | "Spill" | "Other";
}

export interface ServiceRequestInterpreter extends ServiceRequest {
  language:
    | "Spanish"
    | "Mandarin"
    | "French"
    | "ASL"
    | "Russian"
    | "Japanese"
    | "Arabic";
}

export interface ServiceRequestExternalTransport extends ServiceRequest {
  vehicle: "Helicopter" | "Ambulance" | "Car";
  destination: string;
}
