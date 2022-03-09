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
import { CodeType, MethodType, Gate } from "../../types";
import { DateTimeInput, TimeInput } from "semantic-ui-calendar-react";
import { DeleteModal } from "./DeleteModal";
import moment from "moment";

export interface AddMethodData {
  id?: number;
  type: MethodType;
  code: CodeType;
  allGates: boolean;
  gate: number;
  limitDate: boolean;
  limitHours: boolean;
  startDate?: string;
  endDate?: string;
  startHour?: string;
  endHour?: string;
  comment: string;
  enabled: boolean;
}

type AddMethodErrors = {
  [key in keyof AddMethodData]?: string;
};

const initialState = {
  type: "keypad-pin" as MethodType,
  code: {
    pin: "",
    card: "",
    plate: "",
  },
  allGates: true,
  gate: 0,
  limitDate: false,
  limitHours: false,
  startDate: "",
  endDate: "",
  startHour: "",
  endHour: "",
  comment: "",
  enabled: true,
};

interface AddMethodModalProps {
  isOpen: boolean;
  close: () => void;
  submitAction: (data: AddMethodData) => void;
  deleteAction?: (id: number) => void;
  gates: Gate[];
  edit?: boolean;
  methodId?: number;
  editData?: AddMethodData | undefined;
}

export const AddMethodModal = ({
  isOpen,
  close,
  submitAction,
  deleteAction,
  gates,
  edit = false,
  methodId,
  editData,
}: AddMethodModalProps) => {
  const [data, setData] = useState<AddMethodData>(initialState);
  const [modalAction, setModalAction] = useState<string>();
  const [errors, setErrors] = useState<AddMethodErrors>();

  // Reset modal values when modal is re-opened
  useEffect(() => {
    setData(edit ? editData ?? initialState : initialState);
    setErrors({});
  }, [isOpen]);

  const submit = () => {
    validate(data) && submitAction({ id: methodId, ...data });
  };

  const validate = (data: AddMethodData) => {
    let err: AddMethodErrors = {};

    if (
      (data.type === "keypad-pin" || data.type === "keypad-both") &&
      data.code?.pin == ""
    ) {
      err = { ...err, code: "PIN can't be empty" };
    }
    if (
      (data.type === "keypad-card" || data.type === "keypad-both") &&
      data.code?.card == ""
    ) {
      err = { ...err, code: "Card can't be empty" };
    }
    if (data.type === "plate" && data.code?.plate == "") {
      err = { ...err, code: "Plate can't be empty" };
    }
    if (data.limitDate && data.startDate == "") {
      err = { ...err, startDate: "Not a valid date" };
    }
    if (data.limitDate && data.endDate == "") {
      err = { ...err, endDate: "Not a valid date" };
    }
    // Is startHour valid
    if (
      data.limitHours &&
      (data.startHour ?? "").search(/^\d{2}:\d{2}$/) === -1
    ) {
      err = { ...err, startHour: "Not a valid hour" };
    }
    // Is endHour valid
    if (
      data.limitHours &&
      (data.endHour ?? "").search(/^\d{2}:\d{2}$/) === -1
    ) {
      err = { ...err, endHour: "Not a valid hour" };
    }

    setErrors(err);
    return !Object.keys(err).length;
  };

  return (
    <>
      <DeleteModal
        isOpen={modalAction === "delete"}
        type="Method"
        name=""
        close={() => setModalAction("")}
        action={() => {
          setModalAction("");
          deleteAction && deleteAction(methodId ?? 0);
        }}
      />
      <Modal size="mini" onClose={close} open={isOpen} closeIcon>
        <Header>{edit ? "Edit" : "Add"} Method</Header>
        <Modal.Content>
          <Form autoComplete="off">
            <Form.Field
              name="type"
              value={data.type}
              onChange={(
                e: { target: { value: any } },
                { value }: { value: string }
              ) => setData({ ...data, type: value as MethodType })}
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
            <Form.Field
              name="startDate"
              value={
                data.limitDate && data.startDate
                  ? moment(data.startDate).format("DD-MM-YYYY HH:mm")
                  : ""
              }
              onChange={(e: any, { name, value }: any) =>
                setData({
                  ...data,
                  startDate: moment(value, "DD-MM-YYYY HH:mm").toISOString(),
                })
              }
              label="Start Date"
              control={DateTimeInput}
              disabled={!data.limitDate}
              inputMode="none"
              closable
              error={!!errors?.startDate}
              fluid
            />
            <Form.Field
              name="endDate"
              value={
                data.limitDate && data.endDate
                  ? moment(data.endDate).format("DD-MM-YYYY HH:mm")
                  : ""
              }
              onChange={(e: any, { name, value }: any) =>
                setData({
                  ...data,
                  endDate: moment(value, "DD-MM-YYYY HH:mm").toISOString(),
                })
              }
              label="End Date"
              control={DateTimeInput}
              disabled={!data.limitDate}
              inputMode="none"
              closable
              error={!!errors?.endDate}
              fluid
            />
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
                value={data.limitHours ? data.startHour : ""}
                onChange={(e: any, { name, value }: any) =>
                  setData({
                    ...data,
                    startHour: value,
                  })
                }
                label="Start Hour"
                control={TimeInput}
                disabled={!data.limitHours}
                inputMode="none"
                closable
                error={!!errors?.startHour}
                fluid
              />
              <Form.Field
                name="endHour"
                value={data.limitHours ? data.endHour : ""}
                onChange={(e: any, { name, value }: any) =>
                  setData({
                    ...data,
                    endHour: value,
                  })
                }
                label="End Hour"
                control={TimeInput}
                disabled={!data.limitHours}
                inputMode="none"
                closable
                error={!!errors?.endHour}
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
          <Button color="blue" onClick={() => submit()}>
            {edit ? "Save" : "Add"} Method
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
