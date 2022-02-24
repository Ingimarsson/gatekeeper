import {
  Button,
  Checkbox,
  Form,
  Header,
  Input,
  Modal,
} from "semantic-ui-react";
import { useEffect, useState } from "react";

export interface AddUserData {
  name: string;
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  admin: boolean;
  webAccess: boolean;
  enabled: boolean;
}

type AddUserErrors = {
  [key in keyof AddUserData]?: string;
};

interface AddUserModalProps {
  isOpen: boolean;
  close: () => void;
  action: (data: AddUserData) => boolean;
  edit?: boolean;
  editData?: AddUserData;
}

export const AddUserModal = ({
  isOpen,
  close,
  action,
  edit = false,
  editData,
}: AddUserModalProps) => {
  const [data, setData] = useState<AddUserData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    admin: false,
    webAccess: false,
    enabled: true,
  });

  useEffect(() => {
    if (edit && editData) {
      setData(editData);
    }
  }, []);

  const [errors, setErrors] = useState<AddUserErrors>();

  const validate = (data: AddUserData) => {
    let err: AddUserErrors = {};
    if (data.name.length === 0) {
      err = { ...err, name: "Name can't be empty" };
    }
    setErrors(err);
    return !Object.keys(err).length;
  };

  return (
    <Modal size="mini" onClose={close} open={isOpen} closeIcon>
      <Header>{edit ? "Edit" : "Add"} User</Header>
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
            name="username"
            value={data.username}
            onChange={(e: { target: { value: any } }) =>
              setData({ ...data, username: e.target.value })
            }
            label="Username"
            control={Input}
            placeholder="Username"
            fluid
            required
            error={
              errors?.username && {
                pointing: "below",
                content: errors?.username,
              }
            }
          />
          <Form.Field
            name="email"
            value={data.email}
            onChange={(e: { target: { value: any } }) =>
              setData({ ...data, email: e.target.value })
            }
            label="Email"
            control={Input}
            placeholder="Email"
            fluid
            error={
              errors?.email && {
                pointing: "below",
                content: errors?.email,
              }
            }
          />
          <Form.Field
            name="webAccess"
            checked={data.webAccess}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, webAccess: d.checked })}
            label="Web Access"
            control={Checkbox}
            fluid
          />
          {!edit && (
            <>
              <Form.Field
                name="password"
                value={data.webAccess ? data.password : ""}
                onChange={(e: { target: { value: any } }) =>
                  setData({ ...data, password: e.target.value })
                }
                label="Password"
                control={Input}
                placeholder="Password"
                fluid
                required
                type="password"
                disabled={!data.webAccess}
              />
              <Form.Field
                name="confirmPassword"
                value={data.webAccess ? data.confirmPassword : ""}
                onChange={(e: { target: { value: any } }) =>
                  setData({ ...data, confirmPassword: e.target.value })
                }
                label="Confirm Password"
                control={Input}
                placeholder="Confirm Password"
                fluid
                required
                type="password"
                disabled={!data.webAccess}
                error={
                  errors?.confirmPassword && {
                    pointing: "below",
                    content: errors?.confirmPassword,
                  }
                }
              />
            </>
          )}
          <Form.Field
            name="admin"
            checked={data.admin}
            onChange={(
              e: { target: { value: any } },
              d: { checked: boolean }
            ) => setData({ ...data, admin: d.checked })}
            label="Admin"
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
        <Button color="blue" onClick={() => validate(data) && action(data)}>
          {edit ? "Save" : "Add"} User
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
