import { Button } from "../components/button";
import { invoke } from "@tauri-apps/api";
import { Event, listen } from "@tauri-apps/api/event";
import { ResponseType, fetch } from "@tauri-apps/api/http";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Description,
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "../components/fieldset";
import { Switch, SwitchField } from "../components/switch";
import { Select } from "../components/select";
import { Input } from "../components/input";

const API_KEY = "";

export interface ListSitesResponse {
  object: string;
  url: string;
  has_more: boolean;
  data: Site[];
}

export interface Site {
  id: string;
  object: string;
  name: string;
  sharing: string;
  created_at: Date;
}

async function listSites() {
  const res = await fetch<ListSitesResponse>(
    "https://api.usefathom.com/v1/sites",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${API_KEY}` },
      responseType: ResponseType.JSON,
    }
  );

  return res.data;
}

function App() {
  const { data: sites } = useQuery({
    queryKey: ["ListSites"],
    queryFn: listSites,
  });

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
      <Fieldset>
        <Legend>General</Legend>

        <FieldGroup>
          <SwitchField>
            <Label>Launch at login</Label>

            <Switch name="allow_embedding" defaultChecked />
          </SwitchField>

          <Field className="flex items-baseline justify-between gap-6">
            <Label className="!font-normal">Active site</Label>
            <Select name="active_site" className="max-w-64">
              <option value="">Select</option>
              {sites?.data.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </Select>
          </Field>
        </FieldGroup>
      </Fieldset>

      <Fieldset>
        <Legend>Fathom</Legend>

        <FieldGroup>
          <Field>
            <Label>API Key</Label>
            <Description>
              Enter a Fathom API Key to access your account
            </Description>
            <Input name="api_key" />
          </Field>
        </FieldGroup>
      </Fieldset>

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
