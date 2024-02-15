export enum RequestType {
  Flowers,
  Religious,
  Sanitation,
  Interpreter,
  Transport,
}

export const JobAssignments = new Map<RequestType, string[]>([
  [RequestType.Flowers, ["Florist", "flowerdeliveryman"]],
  [RequestType.Religious, ["Priest"]],
  [RequestType.Sanitation, ["Janitor"]],
  [RequestType.Interpreter, ["Spanish Translator", "Mandarin Translator"]],
  [RequestType.Transport, ["Driver", "Pilot"]],
]);

export const ServiceRequestEndpoints = new Map<RequestType, string>([
  [RequestType.Flowers, "services/requests/flowers"],
  [RequestType.Religious, "services/requests/religious"],
  [RequestType.Sanitation, "services/requests/sanitation"],
  [RequestType.Interpreter, "services/requests/interpreter"],
  [RequestType.Transport, "services/requests/transport"],
]);

export interface AllServiceRequests {
  flowers: ServiceRequestFlowers[];
  religious: ServiceRequestReligious[];
  sanitation: ServiceRequestSanitation[];
  interpreter: ServiceRequestInterpreter[];
  transport: ServiceRequestExternalTransport[];
}

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
  faith: "Christianity" | "Judaism" | "Islam" | "Hinduism" | "Buddhism";
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
