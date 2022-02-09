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
import { CodeType, Gate } from "../../types";
import { DateInput, TimeInput } from "semantic-ui-calendar-react";
import { DeleteModal } from "./DeleteModal";

export interface AddMethodData {
  type: string;
  code: CodeType;
  allGates: boolean;
  gate: number;
  limitDate: boolean;
  limitHours: boolean;
  timeLimits: {
    startDate?: string;
    endDate?: string;
    startHour?: string;
    endHour?: string;
  };
  comment: string;
  enabled: boolean;
}

type AddMethodErrors = {
  [key in keyof AddMethodData]?: string;
};

interface AddMethodModalProps {
  isOpen: boolean;
  close: () => void;
  action: (data: AddMethodData) => boolean;
  gates: Gate[];
  edit?: boolean;
  methodId?: number;
  editData?: AddMethodData | undefined;
}

export const AddMethodModal = ({
  isOpen,
  close,
  action,
  gates,
  edit = false,
  methodId,
  editData,
}: AddMethodModalProps) => {
  const initialData = {
    type: "keypad-pin",
    code: {
      pin: "",
      card: "",
      plate: "",
    },
    allGates: true,
    gate: 0,
    limitDate: false,
    limitHours: false,
    timeLimits: {},
    comment: "",
    enabled: true,
  };
  const [data, setData] = useState<AddMethodData>(initialData);

  useEffect(() => {
    if (edit && editData) {
      setData({ ...editData });
    } else {
      setData(initialData);
    }
  }, [edit, methodId]);

  const [errors, setErrors] = useState<AddMethodErrors>();

  const validate = (data: AddMethodData) => {
    let err: AddMethodErrors = {};

    setErrors(err);
    return !Object.keys(err).length;
  };

  const deleteMethod = () => {
    setModalAction("");
    close();
  };

  const [modalAction, setModalAction] = useState<string>();

  return (
    <>
      <DeleteModal
        isOpen={modalAction === "delete"}
        type="Method"
        name=""
        close={() => setModalAction("")}
        action={deleteMethod}
      />
      <Modal size="mini" onClose={close} open={isOpen}>
        <Header>{edit ? "Edit" : "Add"} Method</Header>
        <Modal.Content>
          <Form autoComplete="off">
            <Form.Field
              name="type"
              value={data.type}
              onChange={(
                e: { target: { value: any } },
                { value }: { value: string }
              ) =>
                setData({ ...data, type: value as "gatekeeper" | "generic" })
              }
              label="Method Type"
              control={Dropdown}
              placeholder="Method Type"
              fluid
              selection
              required
              options={[
                {
                  key: "keypad-pin",
                  text: "Keypad (PIN)",
                  value: "keypad-pin",
                },
                {
                  key: "keypad-card",
                  text: "Keypad (Card)",
                  value: "keypad-card",
                },
                {
                  key: "keypad-both",
                  text: "Keypad (PIN and Card)",
                  value: "keypad-both",
                },
                { key: "plate", text: "License Plate", value: "plate" },
              ]}
            />
            {(data.type === "keypad-pin" || data.type === "keypad-both") && (
              <Form.Field
                name="pin"
                value={data.code.pin}
                onChange={(e: { target: { value: any } }) =>
                  setData({
                    ...data,
                    code: { ...data.code, pin: e.target.value },
                  })
                }
                label="PIN"
                control={Input}
                placeholder="PIN"
                fluid
                required
                error={
                  errors?.code && {
                    pointing: "below",
                    content: errors?.code,
                  }
                }
              />
            )}
            {(data.type === "keypad-card" || data.type === "keypad-both") && (
              <Form.Field
                name="code"
                value={data.code.card}
                onChange={(e: { target: { value: any } }) =>
                  setData({
                    ...data,
                    code: { ...data.code, card: e.target.value },
                  })
                }
                label="Card Number"
                control={Input}
                placeholder="Card Number"
                fluid
                required
                error={
                  errors?.code && {
                    pointing: "below",
                    content: errors?.code,
                  }
                }
              />
            )}
            {data.type === "plate" && (
              <Form.Field
                name="plate"
                value={data.code.plate}
                onChange={(e: { target: { value: any } }) =>
                  setData({
                    ...data,
                    code: { ...data.code, plate: e.target.value },
                  })
                }
                label="License Plate"
                control={Input}
                placeholder="License Plate"
                fluid
                required
                error={
                  errors?.code && {
                    pointing: "below",
                    content: errors?.code,
                  }
                }
              />
            )}
            <Form.Field
              name="allGates"
              checked={data.allGates}
              onChange={(
                e: { target: { value: any } },
                d: { checked: boolean }
              ) => setData({ ...data, allGates: d.checked })}
              label="All Gates"
              control={Checkbox}
              fluid
            />
            <Form.Field
              name="gate"
              value={data.gate}
              onChange={(
                e: { target: { value: any } },
                { value }: { value: string }
              ) => setData({ ...data, gate: parseInt(value) })}
              label="Gate"
              control={Dropdown}
              placeholder="Gate"
              disabled={data.allGates}
              fluid
              selection
              required
              options={gates.map((gate) => ({
                key: gate.id,
                text: gate.name,
                value: gate.id,
              }))}
            />
            <Form.Field
              name="limitDate"
              checked={data.limitDate}
              onChange={(
                e: { target: { value: any } },
                d: { checked: boolean }
              ) => setData({ ...data, limitDate: d.checked })}
              label="Limit Date"
              control={Checkbox}
              fluid
            />
            <Form.Group widths="equal">
              <Form.Field
                name="startDate"
                value={data.limitDate ? data.timeLimits.startDate : ""}
                onChange={(e: any, { name, value }: any) =>
                  setData({
                    ...data,
                    timeLimits: { ...data.timeLimits, startDate: value },
                  })
                }
                label="Start Date"
                control={DateInput}
                disabled={!data.limitDate}
                closable
                fluid
              />
              <Form.Field
                name="endDate"
                value={data.limitDate ? data.timeLimits.endDate : ""}
                onChange={(e: any, { name, value }: any) =>
                  setData({
                    ...data,
                    timeLimits: { ...data.timeLimits, endDate: value },
                  })
                }
                label="End Date"
                control={DateInput}
                disabled={!data.limitDate}
                closable
                fluid
              />
            </Form.Group>
            <Form.Field
              name="limitHours"
              checked={data.limitHours}
              onChange={(
                e: { target: { value: any } },
                d: { checked: boolean }
              ) => setData({ ...data, limitHours: d.checked })}
              label="Limit Time of Day"
              control={Checkbox}
              fluid
            />
            <Form.Group widths="equal">
              <Form.Field
                name="startHour"
                value={data.limitHours ? data.timeLimits.startHour : ""}
                onChange={(e: any, { name, value }: any) =>
                  setData({
                    ...data,
                    timeLimits: { ...data.timeLimits, startHour: value },
                  })
                }
                label="Start Hour"
                control={TimeInput}
                disabled={!data.limitHours}
                closable
                fluid
              />
              <Form.Field
                name="endHour"
                value={data.limitHours ? data.timeLimits.endHour : ""}
                onChange={(e: any, { name, value }: any) =>
                  setData({
                    ...data,
                    timeLimits: { ...data.timeLimits, endHour: value },
                  })
                }
                label="End Hour"
                control={TimeInput}
                disabled={!data.limitHours}
                closable
                fluid
              />
            </Form.Group>
            <Form.Field
              name="comment"
              value={data.comment}
              onChange={(e: { target: { value: any } }) =>
                setData({ ...data, comment: e.target.value })
              }
              label="Comment"
              control={Input}
              placeholder="Comment"
              fluid
              error={
                errors?.comment && {
                  pointing: "below",
                  content: errors?.comment,
                }
              }
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
              Delete Method
            </Button>
          )}
          <Button color="blue" onClick={() => validate(data) && action(data)}>
            {edit ? "Save" : "Add"} Method
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
