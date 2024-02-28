import React, { useEffect, useRef, useState } from "react";
import { speak } from "../stores/SpeechEngineBackend.ts";

export interface TalkingHeadProps {
  mouthClosedImage: string;
  mouthOpenImage: string;
  getText: () => string;
  voice: string;
  name: string;
  id?: string;
  onDone?: () => void;
}

export const TalkingHead = (props: TalkingHeadProps) => {
  const mouthStateRef = useRef(false);
  const [mouthState, setMouthState] = useState(false);
  const talkingRef = useRef(false);

  const [talking, setTalking] = useState(false);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    talkingRef.current = talking;
    mouthStateRef.current = mouthState;
  }, [talking, mouthState]);

  function tick() {
    if (talkingRef.current) {
      console.log(mouthStateRef.current);
      setMouthState(!mouthStateRef.current);
    }
    setTimeout(() => {
      tick();
    }, 175);
  }

  if (!initialized) {
    tick();
    setInitialized(true);
  }

  function handleClick() {
    console.log(props.getText());
    const payload = props.getText();
    setTalking(true);
    talkingRef.current = true;

    speak(payload).then(() => {
      setTalking(false);
      setMouthState(false);
      if (props.onDone !== undefined) {
        props.onDone();
      }
      console.log("done talking");
    });
  }

  return (
    <div style={{ padding: "10px" }}>
      <img
        onClick={handleClick}
        width={180}
        height={180}
        src={mouthState ? props.mouthOpenImage : props.mouthClosedImage}
        id={props.id === undefined ? "head" : props.id}
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          borderColor: "black",
          borderWidth: "3px",
          borderStyle: "solid",
        }}
      />
      {/*{speechEngineBackend.aiSpeak?*/}
      {/*<div style={{*/}
      {/*    position:"fixed",*/}
      {/*    padding:0,*/}
      {/*    margin:0,*/}

      {/*    top:0,*/}
      {/*    left:0,*/}

      {/*    width: "100%",*/}
      {/*    height: "100%",*/}
      {/*    background:"rgba(255,255,255,0.5)",*/}
      {/*}}*/}
      {/*onMouseOver={han}/>:<></>}*/}

      <h5>{props.name}</h5>
    </div>
  );
};
