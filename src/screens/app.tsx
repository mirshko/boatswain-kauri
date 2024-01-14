import { Button } from "@/components/button";
import { invoke } from "@tauri-apps/api";
import { Event, listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

function App() {
  const [msg, setMsg] = useState<string>();
  const [rsEvent, setRsEvent] = useState<Event<unknown>>();

  /**
   * Note: setInterval is firing off a promise and does not wait for it to resolve, depending on what you want to get done, it may be smarter to use a different scheduling technique for an async call that may take longer than the interval from time to time.
   */
  useEffect(() => {
    const interval = setInterval(async () => {
      const s = await invoke<string>("interval_action", {
        msg: "interval msg",
      });

      setMsg(s);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    listen("rs_js_emit", (event) => {
      setRsEvent(event);
    });
  }, []);

  const setMenuItem = () => {
    invoke("set_menu_item", { title: `JS count: 10` });
  };

  const addMenuItem = () => {
    invoke("add_menu_item", {
      id: `custom-10`,
      title: `New JS count 10`,
    });
  };

  const setIcon = (label: string) => () => {
    invoke("set_icon", { name: label });
  };

  const makeRequest = async () => {
    console.log("making a request");

    const res = await invoke("api_request", {
      msg: "api msg",
    });

    console.log(res);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-4">
        <Button plain onClick={makeRequest}>
          make request
        </Button>

        <Button plain onClick={setMenuItem}>
          Set menu item
        </Button>

        <Button plain onClick={addMenuItem}>
          Add menu item
        </Button>

        <Button plain onClick={setIcon("notification")}>
          Set tray icon notifications
        </Button>

        <Button plain onClick={setIcon("")}>
          Clear tray icon notifications
        </Button>
      </div>

      <div>
        <div>
          <div>js&rarr;rs (every 5s)</div>
          <div>{msg && msg}</div>
        </div>

        <div>
          <div>rs&rarr;js (every 5s)</div>
          <div>{rsEvent && JSON.stringify(rsEvent as any, null, 2)}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
