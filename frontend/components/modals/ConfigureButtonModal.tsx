import {
  Button,
  Checkbox,
  Form,
  Header,
  Input,
  Label,
  Modal,
} from "semantic-ui-react";
import { useState } from "react";
import { TimeInput } from "semantic-ui-calendar-react";

export interface ConfigureButtonData {
  status: "enabled" | "disabled" | "timer";
  startHour: string;
  endHour: string;
}

interface ConfigureButtonModalProps {
  isOpen: boolean;
  close: () => void;
  initialData: ConfigureButtonData;
  action: (data: ConfigureButtonData) => boolean;
}

export const ConfigureButtonModal = ({
  isOpen,
  close,
  initialData,
  action,
}: ConfigureButtonModalProps) => {
  const [data, setData] = useState<ConfigureButtonData>(initialData);

  return (
    <Modal size="mini" onClose={close} open={isOpen} closeIcon>
      <Header>Button Configuration</Header>
      <Modal.Content>
        <p>
          This setting determines if the gate can be opened with the opening
          button, and during which hours.
        </p>
        <b style={{ marginBottom: 4, display: "block" }}>Button</b>
        <Form>
          <Form.Field
            name="enabled"
            checked={data.status === "enabled"}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, status: "enabled" })}
            label="Enabled"
            control={Checkbox}
            fluid
          />
          <Form.Field
            name="disabled"
            checked={data.status === "disabled"}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, status: "disabled" })}
            label="Disabled"
            control={Checkbox}
            fluid
          />
          <Form.Field
            name="timer"
            checked={data.status === "timer"}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, status: "timer" })}
            label="Time Controlled"
            control={Checkbox}
            fluid
          />
          <Form.Group widths="equal">
            <Form.Field
              name="startHour"
              value={data.startHour ? data.startHour : ""}
              onChange={(e: any, { name, value }: any) =>
                setData({
                  ...data,
                  startHour: value,
                })
              }
              label="Start Hour"
              control={TimeInput}
              disabled={data.status !== "timer"}
              inputMode="none"
              closable
              fluid
            />
            <Form.Field
              name="endHour"
              value={data.endHour ? data.endHour : ""}
              onChange={(e: any, { name, value }: any) =>
                setData({
                  ...data,
                  endHour: value,
                })
              }
              label="End Hour"
              control={TimeInput}
              disabled={data.status !== "timer"}
              inputMode="none"
              closable
              fluid
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={close}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => action(data)}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
