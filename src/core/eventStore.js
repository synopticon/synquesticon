const EventEmitter = require('events')
const MESSAGE_EVENT         = "MQTTEvent"
const MOTION_EVENT          = "MotionEvent"
const PARTICIPANT_EVENT     = "ParticipantEvent"
const REMOTE_TRACKER_EVENT  = "NewRemoteTrackerEvent"
const COMMAND_EVENT         = "CommandEvent"
const SESSION_CONTROL_EVENT = "SessionControlEvent"

class CEventStore extends EventEmitter {
  constructor() {
	  super()
		this.currentMessage = []
    this.currentCommand = []
    this.currentRemoteTracker = null
    this.receivedRemoteTrackers = []
  }

//MESSAGE_EVENT
  setEventListener(status, callback) {
    (status === "on") 
    ? this.addListener(MESSAGE_EVENT, callback)
    : this.removeListener(MESSAGE_EVENT, callback)
  }

  sendCurrentMessage(args) {
		this.currentMessage = args
    this.emit(MESSAGE_EVENT)
  }

  getCurrentMessage(){
		return this.currentMessage
  }

//MOTION_EVENT
  setMotionListener(status, callback) {
    (status === "on") 
      ? this.addListener(MOTION_EVENT, callback)
      : this.removeListener(MOTION_EVENT, callback)
  }

  sendMotionData(args){
    this.currentMessage = args
    this.emit(MOTION_EVENT)
  }

//SESSION_CONTROL_EVENT
  setSessionControlListener(status, callback) {
    (status === "on")
      ? this.addListener(SESSION_CONTROL_EVENT, callback)
      : this.removeListener(SESSION_CONTROL_EVENT, callback)
  }

  sendSessionControlMsg(payload) {
    this.emit(SESSION_CONTROL_EVENT, payload)
  }

//COMMAND_EVENT
  setNewCommandListener(status, callback) {
    (status === "on")
      ? this.addListener(COMMAND_EVENT, callback)
      : this.removeListener(COMMAND_EVENT, callback)
  }

  sendCurrentCommand(args){
    this.currentCommand = args
    this.emit(COMMAND_EVENT)
  }

  getCurrentCommand(){
    return this.currentCommand
  }

//PARTICIPANT_EVENT
  addNewParticipantListener(callback) {
    this.addListener(PARTICIPANT_EVENT, callback)
  }

  removeNewParticipantListener(callback) {
    this.removeListener(PARTICIPANT_EVENT, callback)
  }

  emitNewParticipant() {
    this.emit(PARTICIPANT_EVENT)
  }

//REMOTE_TRACKER_EVENT
  addNewRemoteTrackerListener(callback) {
    this.addListener(REMOTE_TRACKER_EVENT, callback)
  }

  removeNewRemoteTrackerListener(callback) {
    this.removeListener(REMOTE_TRACKER_EVENT, callback)
  }

  emitNewRemoteTrackerListener() {
    if (!this.receivedRemoteTrackers.includes(this.currentRemoteTracker)) 
      this.emit(REMOTE_TRACKER_EVENT)
  }

  getCurrentRemoteTracker(){
    return this.currentRemoteTracker
  }

  setCurrentRemoteTracker(tracker){
    this.currentRemoteTracker = tracker
  }

  confirmRecevingRemoteTracker() {
    this.receivedRemoteTrackers.push(this.currentRemoteTracker)
  }
}

export default new CEventStore()