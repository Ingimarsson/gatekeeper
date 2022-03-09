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
import { GateSettings } from "../../types";

type AddGateErrors = {
  [key in keyof GateSettings]?: string;
};

interface AddGateModalProps {
  isOpen: boolean;
  close: () => void;
  submitAction: (data: GateSettings) => void;
  deleteAction?: () => void;
  edit?: boolean;
  editData?: GateSettings;
}

const initialState: GateSettings = {
  name: "",
  type: "gatekeeper",
  controllerIP: "",
  uriOpen: "",
  uriClose: "",
  cameraUri: "",
  httpTrigger: "",
};

export const AddGateModal = ({
  isOpen,
  close,
  submitAction,
  deleteAction,
  edit = false,
  editData,
}: AddGateModalProps) => {
  const [data, setData] = useState<GateSettings>(initialState);
  const [modalAction, setModalAction] = useState<string>("");

  // Reset modal values when modal is re-opened
  useEffect(() => {
    setData(edit ? editData ?? initialState : initialState);
    setErrors({});
  }, [isOpen]);

  const submit = () => {
    validate(data) && submitAction(data);
  };

  const [errors, setErrors] = useState<AddGateErrors>();

  const validate = (data: GateSettings) => {
    let err: AddGateErrors = {};

    // Is name valid
    if (data.name.length === 0) {
      err = { ...err, name: "Name can't be empty" };
    }

    // Is IP valid (only for gatekeeper type)
    if (
      data.type === "gatekeeper" &&
      data.controllerIP?.split(".").length !== 4
    ) {
      err = { ...err, controllerIP: "Not a valid IP address" };
    }

    setErrors(err);
    return !Object.keys(err).length;
  };

  return (
    <>
      {" "}
      <DeleteModal
        isOpen={modalAction === "delete"}
        type="Gate"
        name={editData?.name ?? ""}
        close={() => setModalAction("")}
        action={() => !!deleteAction && deleteAction()}
      />
      <Modal size="mini" onClose={close} open={isOpen} closeIcon>
        <Header>{edit ? "Edit" : "Add"} Gate</Header>
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
              name="type"
              value={data.type}
              onChange={(
                e: { target: { value: any } },
                { value }: { value: string }
              ) =>
                setData({ ...data, type: value as "gatekeeper" | "generic" })
              }
              label="Controller Type"
              control={Dropdown}
              placeholder="Controller Type"
              fluid
              selection
              required
              options={[
                {
                  key: "gatekeeper",
                  text: "Gatekeeper Module",
                  value: "gatekeeper",
                },
                { key: "generic", text: "Generic", value: "generic" },
              ]}
            />
            {data.type === "gatekeeper" ? (
              <>
                <Form.Field
                  name="controllerIP"
                  value={data.controllerIP}
                  onChange={(e: { target: { value: any } }) =>
                    setData({ ...data, controllerIP: e.target.value })
                  }
                  label="Controller IP"
                  control={Input}
                  placeholder="Controller IP"
                  fluid
                  required
                  error={
                    errors?.controllerIP && {
                      pointing: "below",
                      content: errors?.controllerIP,
                    }
                  }
                />
              </>
            ) : (
              <>
                <Form.Field
                  name="openUrl"
                  value={data.uriOpen}
                  onChange={(e: { target: { value: any } }) =>
                    setData({ ...data, uriOpen: e.target.value })
                  }
                  label="Open URL"
                  control={Input}
                  placeholder="Open URL"
                  fluid
                />
                <Form.Field
                  name="closeUrl"
                  value={data.uriClose}
                  onChange={(e: { target: { value: any } }) =>
                    setData({ ...data, uriClose: e.target.value })
                  }
                  label="Close URL"
                  control={Input}
                  placeholder="Close URL"
                  required
                  fluid
                />
              </>
            )}
            <Form.Field
              name="cameraURL"
              value={data.cameraUri}
              onChange={(e: { target: { value: any } }) =>
                setData({ ...data, cameraUri: e.target.value })
              }
              label="Camera Stream (RTSP)"
              control={Input}
              placeholder="Camera Stream (RTSP)"
              fluid
            />
            <Form.Field
              name="dvrTriggerURL"
              value={data.httpTrigger}
              onChange={(e: { target: { value: any } }) =>
                setData({ ...data, httpTrigger: e.target.value })
              }
              label="DVR Trigger URL"
              control={Input}
              placeholder="DVR Trigger URL"
              fluid
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          {edit && (
            <Button color="red" onClick={() => setModalAction("delete")}>
              Delete Gate
            </Button>
          )}
          <Button color="blue" onClick={() => submit()}>
            {edit ? "Save" : "Add"} Gate
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
