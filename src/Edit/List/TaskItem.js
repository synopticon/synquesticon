import React from 'react'
import Button from '@material-ui/core/Button'
import DragIcon from '@material-ui/icons/ControlCamera'
import './TaskItem.css'
import { Typography } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import * as dnd from '../../core/beautifulDND.js'

const TaskItem = props => {
  let setRef = ref => {     // give the dom ref to react-beautiful-dnd
    props.domRef(ref)
  }

  const { theme, provided, isDragging, snapshot } = props
  let leftBG = theme.palette.type === "light" ? theme.palette.primary.dark : theme.palette.primary.main
  let dragHighlight = isDragging ? theme.palette.secondary.main + "66" : leftBG
  const opacityValue = isDragging ? 0.8 : 1

  if (provided === undefined) {
    return null
  }

  let highlightColor = null
  if (props.highlight) {
    highlightColor = { backgroundColor: theme.palette.secondary.main + "66" }
  }

  const dragButton = props.dragEnabled ? <div className="listItemDragBtnContainer" style={{ backgroundColor: dragHighlight }}><Button style={{ cursor: 'move', width: '100%', height: '100%', minWidth: '30px', minHeight: '30px' }}
    className="listItemDragBtn" size="small" fullWidth >
    <DragIcon className="dragBtnIcon" />
  </Button></div> : null

  const dragStyle = dnd.getItemStyle( //Was style={backgroundColor:leftBG}
    snapshot,
    provided.draggableProps.style,
    leftBG,
    leftBG
  )

  return (
    <div ref={setRef}{...provided.draggableProps}{...provided.dragHandleProps}
      className={"listItem"} style={{ ...dragStyle, ...{ opacity: opacityValue }, ...highlightColor }}
      onClick={() => props.onSelectedCallback(props.task)}>
      <div className="listItemTextContainer" >
        <div className="listItemText">
          <Typography color="textPrimary" noWrap> {props.content} </Typography>
        </div>
      </div>
      {dragButton}
    </div>
  )
}

export default withTheme(TaskItem)