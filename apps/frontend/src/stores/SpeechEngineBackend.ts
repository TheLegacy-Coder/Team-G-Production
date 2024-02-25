import "regenerator-runtime/runtime";
import SpeechRecognition from "react-speech-recognition";

class SpeechEngineBackend {
  public GREETING = "Okay Tommy";
  public currentCommand: string[] = [];
  private watchdog: NodeJS.Timeout | undefined;
  public speechClass = "speech-engine-start";
  public end: (resolved: boolean) => void = (resolved: boolean) => {
    console.log(resolved);
  };
  constructor() {
    SpeechRecognition.startListening({ continuous: true });
  }

  public commands = [
    {
      command: `${this.GREETING} debug speech *`,
      callback: (speech: string) => {
        console.log(speech);
      },
    },
  ];

  public Update(transcript: string) {
    const words = transcript.toLowerCase().split(" ");
    const greetingWords = this.GREETING.toLowerCase().split(" ");

    let hitIndex = -1;
    let found = false;
    for (let i = 0; i < words.length; i++) {
      if (hitIndex === -1) {
        if (words[i] === greetingWords[0]) {
          hitIndex = i;
        }
      } else {
        if (words[i] === greetingWords[i - hitIndex]) {
          if (i - hitIndex + 1 === greetingWords.length) {
            found = true;
            break;
          }
        } else {
          if (words[i] === greetingWords[0]) {
            hitIndex = i;
          } else {
            hitIndex - 1;
          }
        }
      }
    }

    if (found) {
      this.currentCommand = words.splice(hitIndex);
      if (this.watchdog !== undefined) {
        clearTimeout(this.watchdog);
        this.watchdog = undefined;
      }
      this.watchdog = setTimeout(() => {
        this.end(false);
        this.currentCommand = [];
      }, 2000);
    } else {
      this.currentCommand = [];
    }
    console.log(this.currentCommand);
  }

  public RegisterCommands(command: {
    isFuzzyMatch?: boolean;
    fuzzyMatchingThreshold?: number;
    commands: string[];
    callback: (speech: string) => void;
  }) {
    command.commands.forEach((cmd) => {
      this.RegisterCommand({
        command: cmd,
        callback: command.callback,
      });
    });
  }

  public RegisterCommand(command: {
    isFuzzyMatch?: boolean;
    fuzzyMatchingThreshold?: number;
    command: string;
    callback: (speech: string) => void;
  }) {
    command.command = `${this.GREETING} ${command.command}`;
    const cb = command.callback;
    command.callback = (speech: string) => {
      if (this.watchdog !== undefined) {
        clearTimeout(this.watchdog);
        this.watchdog = undefined;
      }
      cb(speech);
      this.end(true);
    };
    // command.isFuzzyMatch =  true;
    //     command.fuzzyMatchingThreshold = 0.0001;
    console.log(command.command);
    let dupe = false;
    this.commands.forEach((cmd) => {
      if (cmd.command === command.command) {
        console.log("rejecting duplicate");
        dupe = true;
        return;
      }
    });
    if (!dupe) this.commands.push(command);
  }
}

export const speechEngineBackend = new SpeechEngineBackend();
