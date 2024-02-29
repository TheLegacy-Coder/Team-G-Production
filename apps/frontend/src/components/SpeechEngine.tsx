import React, { useCallback, useEffect, useReducer, useState } from "react";
import "regenerator-runtime/runtime";

import { useSpeechRecognition } from "react-speech-recognition";
import { speak, speechEngineBackend } from "../stores/SpeechEngineBackend.ts";
import { mouse } from "../map/Mouse";
import "./styles/SpeechEngine.css";
import { TalkingHead } from "./TalkingHead.tsx";

export const SpeechEngine = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const commands = speechEngineBackend.commands;
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands });

  const [init, setInit] = useState(false);

  const endOfSpeech = useCallback(
    (resolved: boolean) => {
      resetTranscript();
      speechEngineBackend.currentCommand = [];
      if (resolved) {
        speechEngineBackend.response = "Very well.";
      } else {
        speechEngineBackend.response = "I'm sorry, I dont understand.";
      }
      speechEngineBackend.aiSpeak = true;

      document.getElementById("ai-head")?.click();
      console.log(resolved);
    },
    [resetTranscript],
  );

  useEffect(() => {
    speechEngineBackend.RegisterCommand({
      command: ``,
      callback: () => {
        console.log("start");
      },
    });
    speechEngineBackend.end = endOfSpeech;
  }, [endOfSpeech]);

  let active = false;

  useEffect(() => {
    speechEngineBackend.Update(transcript);
  }, [resetTranscript, transcript]);
  active = speechEngineBackend.currentCommand.length > 0;
  let text = "";
  speechEngineBackend.currentCommand.forEach((word) => {
    text += word[0].toUpperCase() + word.slice(1) + " ";
  });

  if (!browserSupportsSpeechRecognition) {
    return <></>;
  }

  if (active) {
    speechEngineBackend.speechClass = "speech-engine-in";
  }

  return (
    <div className={speechEngineBackend.speechClass}>
      <div className={"speech-content"}>
        <TalkingHead
          name={""}
          voice={"Google UK English Male"}
          mouthClosedImage={"tommy/close.jpg"}
          mouthOpenImage={"tommy/open.jpg"}
          id={"ai-head"}
          getText={() => {
            return speechEngineBackend.response;
          }}
          onDone={() => {
            speechEngineBackend.speechClass = "speech-engine-out";
            forceUpdate();
          }}
        />

        <h5 className={"speech-text"}>{text}</h5>
      </div>
      {!init ? (
        <div
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            left: "0",
            top: "0",
          }}
          onClick={() => {
            console.log("gotcha");
            setInit(true);
            speak("");
          }}
          onTouchStart={(evt) => {
            console.log("gotcha");
            setInit(true);
            speak("");
            mouse.divTouchStart(evt);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
