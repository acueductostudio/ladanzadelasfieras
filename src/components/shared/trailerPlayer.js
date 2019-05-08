import React, { useState } from "react";
import ReactPlayer from "react-player";
import { whiteColor } from "components/layout/pageLayout";
import styled, { css, keyframes } from "styled-components/macro";
import { ReactComponent as Play } from "assets/img/layout/play.svg";
import { ReactComponent as Pause } from "assets/img/layout/pause.svg";

//52.7 es el de todos menos, desechables tiene una línea negra a la derecha y el trailer está en 1080p

const VideoWrapper = styled.div`
  div:last-of-type {
    height: auto !important;
  }
  padding-bottom: ${props => props.ratio || "52.7%"};
  display: block;
  position: relative;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: black;
  }
`;

const hidePause = keyframes`
  0% {
    opacity:0;
  }
  5% {
    opacity:1;
  }
  90% {
    opacity:1;
  }
  100% {
    opacity:0;
  }
`;

const Clicker = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  position: absolute;
  pointer-events: auto;
  z-index: 3;
  cursor: pointer;
  ${props =>
    props.hideSvg &&
    css`
      svg {
        opacity: 0;
      }
      :hover {
        svg {
          animation: ${hidePause} 2.4s;
          animation-fill-mode: forwards;
        }
      }
    `}
  svg {
    width: 35px;
    height: 35px;
    position: absolute;
    left: calc(50% - 17.5px);
    top: calc(50% + 17.5px);
    transition: opacity 0.4s ease;
    z-index: 3;
    polygon,
    rect {
      stroke: ${whiteColor};
      stroke-width: 26px;
      fill: none;
      stroke: rgb(255, 255, 255);
      stroke-linejoin: round;
      stroke-miterlimit: 10;
    }
  }
`;

const Fader = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
  transition: 0.4s ease opacity;
  margin-bottom: 50px;
  pointer-events: none;
  ${props =>
    props.hide &&
    css`
      opacity: 0;
    `}
`;

const OverStill = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  cursor: pointer;
  transition: 0.4s ease opacity;
  opacity: ${props => (props.hide ? "0" : "1")};
  pointer-events: ${props => (props.hide ? "none" : "auto")};
  background-size: cover;
`;

const PlayButton = styled(Play)`
  width: 35px;
  height: 35px;
  position: absolute;
  left: calc(50% - 17.5px);
  top: calc(50% - 17.5px);
  z-index: 3;
  cursor: pointer;
  polygon {
    stroke-width: 26px;
    fill: none;
  }
  opacity: ${props => (props.hide ? "0" : "1")};
`;

const PauseButton = styled(Pause)`
  width: 35px;
  height: 35px;
  position: absolute;
  left: calc(50% - 17.5px);
  top: calc(50% - 17.5px);
  z-index: 3;
  cursor: pointer;
  polygon,
  rect {
    stroke: ${whiteColor};
    stroke-width: 26px;
    fill: none;
    stroke: rgb(255, 255, 255);
    stroke-linejoin: round;
    stroke-miterlimit: 10;
  }
  opacity: ${props => (props.hide ? "0" : "1")};
`;

function TrailerPlayer(props) {
  const [isPlaying, setPlaying] = useState(false);
  const [isInitial, setInitial] = useState(true);

  function handlePlay(bool = !isPlaying, bool2 = null) {
    setPlaying(bool);
    setInitial(false);
  }

  function pauseVideo() {
    setPlaying(false);
  }

  function restoreVideo() {
    setPlaying(false);
    setInitial(true);
  }

  return (
    <VideoWrapper ratio={props.ratio}>
      <Clicker onClick={() => handlePlay()} hideSvg={isPlaying}>
        {isPlaying ? <PauseButton id="paused" /> : <PlayButton />}
      </Clicker>
      <Fader hide={isPlaying} />
      <OverStill
        style={{ backgroundImage: `url(${props.still})` }}
        hide={!isInitial}
        onClick={() => handlePlay(true)}
      />
      <ReactPlayer
        playing={isPlaying}
        url={props.url}
        controls={false}
        style={{ height: "auto !important" }}
        width="100%"
        onEnded={() => restoreVideo()}
        onPause={() => pauseVideo()}
        onPlay={() => handlePlay(true)}
      />
    </VideoWrapper>
  );
}

export default TrailerPlayer;