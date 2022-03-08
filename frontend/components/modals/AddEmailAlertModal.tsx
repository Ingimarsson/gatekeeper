import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  Header,
  Input,
  Modal,
} from "semantic-ui-react";
import { useEffect, useState } from "react";
import { DeleteModal } from "./DeleteModal";
import { Alert, Gate, GateSettings, User } from "../../types";
import { TimeInput } from "semantic-ui-calendar-react";

type AddEmailAlertErrors = {
  [key in keyof GateSettings]?: string;
};

interface AddEmailAlertProps {
  isOpen: boolean;
  close: () => void;
  action: (data: Alert) => boolean;
  gates: Gate[];
  users: User[];
  edit?: boolean;
  alertId?: number;
  editData?: Alert;
}

export const AddEmailAlertModal = ({
  isOpen,
  close,
  action,
  gates,
  users,
  edit = false,
  alertId,
  editData,
}: AddEmailAlertProps) => {
  const initialData: Alert = {
    id: 0,
    name: "",
    gate: "",
    gateId: 0,
    user: "",
    userId: 0,
    method: "any",
    code: "",
    timeLimits: false,
    startHour: "",
    endHour: "",
    failedAttempts: false,
    enabled: true,
  };
  const [data, setData] = useState<Alert>(initialData);

  const methods = [
    { key: "any", text: "All Methods", value: "any" },
    { key: "web", text: "Web Interface", value: "web" },
    { key: "keypad", text: "Keypad", value: "keypad" },
    { key: "plate", text: "Plate", value: "plate" },
    { key: "button-1", text: "Button 1", value: "button-1" },
    { key: "button-2", text: "Button 2", value: "button-2" },
    { key: "button-2", text: "Button 3", value: "button-2" },
  ];

  useEffect(() => {
    if (edit && editData) {
      setData({ ...data, ...editData });
    } else {
      setData(initialData);
    }
  }, [alertId, isOpen]);

  const [errors, setErrors] = useState<AddEmailAlertErrors>();

  const deleteAlert = () => {
    setModalAction("");
    close();
  };

  const [modalAction, setModalAction] = useState<string>();

  const validate = (data: Alert) => {
    let err: AddEmailAlertErrors = {};
    return !Object.keys(err).length;
  };

  console.log(editData);
  console.log(alertId);

  return (
    <>
      {" "}
      <DeleteModal
        isOpen={modalAction === "delete"}
        type="Alert"
        name={editData?.name ?? ""}
        close={() => setModalAction("")}
        action={deleteAlert}
      />
      <Modal size="mini" onClose={close} open={isOpen} closeIcon>
        <Header>{edit ? "Edit" : "Add"} Email Alert</Header>
        <Modal.Content>
          <Form>
            <Form.Field
              name="name"
              value={data.name}
              onChange={(e: { target: { value: any } }) =>
                setData({ ...data, name: e.target.value })
              }
              label="Name"
              control={Input}
              placeholder="Name"
              fluid
              required
              error={
                errors?.name && {
                  pointing: "below",
                  content: errors?.name,
                }
              }
            />
            <Form.Field
              name="gate"
              value={data.gateId}
              onChange={(
                e: { target: { value: any } },
                { value }: { value: string }
              ) => setData({ ...data, gateId: parseInt(value) })}
              label="Gate"
              control={Dropdown}
              placeholder="Gate"
              fluid
              selection
              required
              options={[
                { key: 0, text: "All Gates", value: 0 },
                ...gates.map((gate) => ({
                  key: gate.id,
                  text: gate.name,
                  value: gate.id,
                })),
              ]}
            />
            <Form.Field
              name="user"
              value={data.userId}
              onChange={(
                e: { target: { value: any } },
                { value }: { value: string }
              ) => setData({ ...data, userId: parseInt(value) })}
              label="User"
              control={Dropdown}
              placeholder="User"
              fluid
              selection
              required
              options={[
                { key: 0, text: "All Users", value: 0 },
                ...users.map((user) => ({
                  key: user.id,
                  text: user.name,
                  value: user.id,
                })),
              ]}
            />
            <Form.Field
              name="method"
              value={data.method}
              onChange={(
                e: { target: { value: any } },
                { value }: { value: string }
              ) => setData({ ...data, method: value as any })}
              label="Method"
              control={Dropdown}
              placeholder="Method"
              fluid
              selection
              required
              options={methods}
            />
            {data.method === "plate" && (
              <Form.Field
                name="code"
                value={data.code}
                onChange={(e: { target: { value: any } }) =>
                  setData({ ...data, code: e.target.value })
                }
                label="Code"
                control={Input}
                placeholder="Code"
                fluid
              />
            )}
            <Form.Field
              name="timeLimits"
              checked={data.timeLimits}
              onChange={(
                e: { target: { value: any } },
                d: { checked: boolean }
              ) => setData({ ...data, timeLimits: d.checked })}
              label="Limit Hours"
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
                disabled={!data.timeLimits}
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
                disabled={!data.timeLimits}
                inputMode="none"
                closable
                fluid
              />
            </Form.Group>
            <Form.Field
              name="failedAttempts"
              checked={data.failedAttempts}
              onChange={(
                e: { target: { value: any } },
                d: { checked: boolean }
              ) => setData({ ...data, failedAttempts: d.checked })}
              label="Include Failed Attempts"
              control={Checkbox}
              fluid
            />
            <Form.Field
              name="enabled"
              checked={data.enabled}
              onChange={(
                e: { target: { value: any } },
                d: { checked: boolean }
              ) => setData({ ...data, enabled: d.checked })}
              label="Enabled"
              control={Checkbox}
              fluid
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {edit && (
            <Button color="red" onClick={() => setModalAction("delete")}>
              Delete Alert
            </Button>
          )}
          <Button color="blue" onClick={() => validate(data) && action(data)}>
            {edit ? "Save" : "Add"} Alert
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
