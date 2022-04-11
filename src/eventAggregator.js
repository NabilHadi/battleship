const COMPUTER_PLAYED_EVENT = "computerPlayed";
const PRE_GAME_STAGE_EVENT = "preGame";
const SHIP_PLACEMENT_STAGE_EVENT = "shipPlacement";
const GAME_START_EVENT = "gameStart";
const GAME_END_EVENT = "gameEnded";
const RESTART_GAME_EVENT = "restartGame";

const EventAggregator = (function () {
  function Event(name) {
    this._handlers = [];
    this.name = name;
  }
  Event.prototype.addHandler = function (handler) {
    this._handlers.push(handler);
  };
  Event.prototype.removeHandler = function (handler) {
    this._handlers = this._handlers.filter((h) => {
      h !== handler;
    });
  };
  Event.prototype.fire = function (eventArgs) {
    this._handlers.forEach(function (h) {
      h(eventArgs);
    });
  };

  const events = [];

  function getEvent(eventName) {
    return events.find((e) => {
      return e.name === eventName;
    });
  }

  return {
    publish(eventName, eventArgs) {
      let event = getEvent(eventName);

      if (!event) {
        event = new Event(eventName);
        events.push(event);
      }

      event.fire(eventArgs);
    },
    subscribe(eventName, handler) {
      let event = getEvent(eventName);

      if (!event) {
        event = new Event(eventName);
        events.push(event);
      }

      event.addHandler(handler);
    },
  };
})();

export default EventAggregator;
export {
  COMPUTER_PLAYED_EVENT,
  PRE_GAME_STAGE_EVENT,
  SHIP_PLACEMENT_STAGE_EVENT,
  GAME_START_EVENT,
  GAME_END_EVENT,
  RESTART_GAME_EVENT,
};
