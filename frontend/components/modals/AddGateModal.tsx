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
  action: (data: GateSettings) => boolean;
  edit?: boolean;
  editData?: GateSettings;
}

export const AddGateModal = ({
  isOpen,
  close,
  action,
  edit = false,
  editData,
}: AddGateModalProps) => {
  const [data, setData] = useState<GateSettings>({
    name: "",
    type: "gatekeeper",
    controllerIP: "",
    openUrl: "",
    closeUrl: "",
    cameraEnabled: true,
    cameraUrl: "",
    dvrTriggerUrl: "",
  });

  useEffect(() => {
    if (edit && editData) {
      setData({ ...data, ...editData });
    }
  }, []);

  const [errors, setErrors] = useState<AddGateErrors>();

  const deleteGate = () => {
    setModalAction("");
    close();
  };

  const [modalAction, setModalAction] = useState<string>();

  const validate = (data: GateSettings) => {
    let err: AddGateErrors = {};
    if (data.name.length === 0) {
      err = { ...err, name: "Name can't be empty" };
    }
    if (
      data.type === "gatekeeper" &&
      data.controllerIP?.split(".").length !== 4
    ) {
      err = { ...err, controllerIP: "Not a valid IP address" };
    }
    if (data.type === "generic" && data.closeUrl?.length === 0) {
      err = { ...err, closeUrl: "Close URL can't be empty" };
    }
    if (data.cameraEnabled && data.cameraUrl.length === 0) {
      err = { ...err, cameraUrl: "Camera URL can't be empty" };
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
        action={deleteGate}
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
                  value={data.openUrl}
                  onChange={(e: { target: { value: any } }) =>
                    setData({ ...data, openUrl: e.target.value })
                  }
                  label="Open URL"
                  control={Input}
                  placeholder="Open URL"
                  fluid
                />
                <Form.Field
                  name="closeUrl"
                  value={data.closeUrl}
                  onChange={(e: { target: { value: any } }) =>
                    setData({ ...data, closeUrl: e.target.value })
                  }
                  label="Close URL"
                  control={Input}
                  placeholder="Close URL"
                  required
                  fluid
                  error={
                    errors?.closeUrl && {
                      pointing: "below",
                      content: errors?.closeUrl,
                    }
                  }
                />
              </>
            )}
            <Form.Field
              name="cameraEnabled"
              checked={data.cameraEnabled}
              onChange={(
                e: { target: { value: any } },
                d: { checked: boolean }
              ) => setData({ ...data, cameraEnabled: d.checked })}
              label="Enable Camera"
              control={Checkbox}
              fluid
            />
            <Form.Field
              name="cameraURL"
              value={data.cameraEnabled ? data.cameraUrl : ""}
              onChange={(e: { target: { value: any } }) =>
                setData({ ...data, cameraUrl: e.target.value })
              }
              label="Camera Stream (RTSP)"
              control={Input}
              disabled={!data.cameraEnabled}
              placeholder="Camera Stream (RTSP)"
              fluid
              error={
                errors?.cameraUrl && {
                  pointing: "below",
                  content: errors?.cameraUrl,
                }
              }
            />
            <Form.Field
              name="dvrTriggerURL"
              value={data.dvrTriggerUrl}
              onChange={(e: { target: { value: any } }) =>
                setData({ ...data, dvrTriggerUrl: e.target.value })
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
          <Button color="blue" onClick={() => validate(data) && action(data)}>
            {edit ? "Save" : "Add"} Gate
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};
