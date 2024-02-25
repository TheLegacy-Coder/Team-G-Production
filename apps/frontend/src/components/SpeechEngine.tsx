import React, { useCallback, useEffect, useReducer } from "react";
import "regenerator-runtime/runtime";
import { useSpeechRecognition } from "react-speech-recognition";
import { speechEngineBackend } from "../stores/SpeechEngineBackend.ts";
import "./styles/SpeechEngine.css";

export const SpeechEngine = () => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const commands = speechEngineBackend.commands;
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition({ commands });

  const endOfSpeech = useCallback(
    (resolved: boolean) => {
      resetTranscript();
      speechEngineBackend.currentCommand = [];
      speechEngineBackend.speechClass = "speech-engine-out";
      forceUpdate();
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
    return <span>Browser doesn't support speech recognition.</span>;
  }

  if (active) {
    speechEngineBackend.speechClass = "speech-engine-in";
  }

  return (
    <div className={speechEngineBackend.speechClass}>
      <div className={"speech-content"}>
        {/*
                credit for animation: https://loading.io/css/
                */}
        <div className="lds-grid">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <h5 className={"speech-text"}>{text}</h5>
      </div>
    </div>
  );
};
