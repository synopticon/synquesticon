import React, { useState } from 'react'
import store from '../../core/store'
import mqtt from '../../core/mqtt'
import Button from '@material-ui/core/Button'
import PauseIcon from '@material-ui/icons/PauseCircleOutline'
import PlayIcon from '@material-ui/icons/PlayCircleOutline'
import LinearProgress from '@material-ui/core/LinearProgress'
import { Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

const ObserverTab = props => {
  const [allPaused] = useState(props.participantObject.allPaused)
  const [isParticipantPaused, setIsParticipantPaused] = useState(false)

  const onTabPressed = evt => {
    evt.stopPropagation()
    evt.preventDefault()
    props.tabPressedCallback(props.index)
    return false
  }

  const onButtonPressed = evt => {
    evt.stopPropagation()
    evt.preventDefault()
    mqtt.broadcastMessage(JSON.stringify({
      commandType: !isParticipantPaused ? "PAUSE" : "RESUME",
      participantId: props.participantObject.participantID
    }), 'command')

    if (!allPaused)
      setIsParticipantPaused(!isParticipantPaused)

    return false
  }

  let buttonIcon = null
  const activeTextStyle = props.isActive ? { color: props.theme.palette.secondary.main } : { color: props.theme.palette.text.primary }
  const activeUnderlineStyle = { boxShadow: '0 0 8px -6px' + props.isActive ? props.theme.palette.secondary.main : 'grey' }
  const shouldHighlight = window.matchMedia("(any-pointer: coarse)").matches ? activeUnderlineStyle : {}

  if (isParticipantPaused || allPaused)
    buttonIcon = <PauseIcon style={{ display: 'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1 }} />
  else
    buttonIcon = <PlayIcon style={{ display: 'flex', position: 'absolute', height: '100%', width: 'auto', maxWidth: '100%', flexGrow: 1 }} />

  let participantBigScreen = null
  let participantSmallScreen = null
  let dotText = null

  if (store.getState().windowSize.height > 500) {
    participantBigScreen =
      <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, position: 'relative', paddingBottom: 5, marginRight: 5, height: '40%' }}>
        <Button style={{ display: 'flex', position: 'relative', width: 30, height: 30 }}
          onClick={onButtonPressed}>
          {buttonIcon}
        </Button>
        <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', flexGrow: 1 }}>
          {<div style={{ display: 'flex', width: '100%', height: 10, marginBottom: 3, justifyContent: 'center', alignItems: 'center' }}>
            <Typography color="textPrimary"> {props.completedTasks} / {props.totalTasks} </Typography>
          </div>}
          <LinearProgress color="secondary" style={{ display: 'flex', width: '100%', height: 10 }} variant="determinate" value={(props.completedTasks / props.totalTasks) * 100} />
        </div>
      </div>
  } else {
    participantSmallScreen =
      <Button style={{ zIndex: 10, display: 'flex', position: 'relative', width: 30, height: 30 }}
        onClick={onButtonPressed}>
        {buttonIcon}
      </Button>
    dotText = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
  }

  return (
    <div style={{ ...shouldHighlight, ...{ alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, marginLeft: 5, display: 'flex', flexDirection: 'column', cursor: 'pointer', position: 'relative', height: '100%', width: 250 } }}>
      <div onClick={onTabPressed} style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: "100%", height: "60%" }}>
        <div style={{ ...activeTextStyle, ...{ display: 'flex', flexDirection: 'row', position: 'relative', width: '100%', height: '100%' }, ...dotText }}>
          {participantSmallScreen}<div style={{ ...{ display: 'flex', flexDirection: 'column', position: 'relative', width: "100%", height: "100%" } }}>
            <p style={{ textAlign: 'center', margin: 0, padding: 0, width: '100%' }}>{props.participantObject.participantLabel}</p>
            <p style={{ textAlign: 'center', margin: 0, padding: 0, width: '100%' }}>{props.participantObject.sessionStartTime}</p>
          </div>
        </div>
        {participantBigScreen}
      </div>
    </div>
  )
}

export default withTheme(ObserverTab)