import {
  Button,
  Checkbox,
  Form,
  Header,
  Input,
  Label,
  Modal,
} from "semantic-ui-react";
import { useEffect, useState } from "react";
import { TimeInput } from "semantic-ui-calendar-react";

export interface ConfigureButtonData {
  type: "enabled" | "disabled" | "timer";
  startHour: string;
  endHour: string;
}

interface ConfigureButtonModalProps {
  isOpen: boolean;
  close: () => void;
  initialData: ConfigureButtonData;
  action: (data: ConfigureButtonData) => void;
}

type ConfigureButtonErrors = {
  [key in keyof ConfigureButtonData]?: string;
};

export const ConfigureButtonModal = ({
  isOpen,
  close,
  initialData,
  action,
}: ConfigureButtonModalProps) => {
  const [data, setData] = useState<ConfigureButtonData>(initialData);
  const [errors, setErrors] = useState<ConfigureButtonErrors>();

  const submit = () => {
    if (validate(data)) {
      action(data);
    }
  };

  // Reset modal values when modal is re-opened
  useEffect(() => {
    setData(initialData);
  }, [isOpen]);

  const validate = (data: ConfigureButtonData) => {
    let err: ConfigureButtonErrors = {};

    // Is startHour valid
    if (
      data.type === "timer" &&
      data.startHour.search(/^\d{2}:\d{2}$/) === -1
    ) {
      err = { ...err, startHour: "Not a valid hour" };
    }
    // Is endHour valid
    if (data.type === "timer" && data.endHour.search(/^\d{2}:\d{2}$/) === -1) {
      err = { ...err, endHour: "Not a valid hour" };
    }
    setErrors(err);
    return !Object.keys(err).length;
  };

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
            checked={data.type === "enabled"}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, type: "enabled" })}
            label="Enabled"
            control={Checkbox}
            fluid
          />
          <Form.Field
            name="disabled"
            checked={data.type === "disabled"}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, type: "disabled" })}
            label="Disabled"
            control={Checkbox}
            fluid
          />
          <Form.Field
            name="timer"
            checked={data.type === "timer"}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, type: "timer" })}
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
              disabled={data.type !== "timer"}
              inputMode="none"
              closable
              error={!!errors?.startHour}
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
              disabled={data.type !== "timer"}
              inputMode="none"
              closable
              error={!!errors?.endHour}
              fluid
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={close}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => submit()}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
