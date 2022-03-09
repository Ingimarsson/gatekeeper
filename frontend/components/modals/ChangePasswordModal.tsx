import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import { useState, useEffect } from "react";

export interface ChangePasswordData {
  password: string;
  confirmPassword: string;
}

type ChangePasswordErrors = {
  [key in keyof ChangePasswordData]?: string;
};

const initialState = {
  password: "",
  confirmPassword: "",
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  close: () => void;
  action: (data: ChangePasswordData) => void;
}

export const ChangePasswordModal = ({
  isOpen,
  close,
  action,
}: ChangePasswordModalProps) => {
  const [data, setData] = useState<ChangePasswordData>(initialState);
  const [errors, setErrors] = useState<ChangePasswordErrors>();

  // Reset modal values when modal is re-opened
  useEffect(() => {
    setData(initialState);
    setErrors({});
  }, [isOpen]);

  const validate = (data: ChangePasswordData) => {
    let err: ChangePasswordErrors = {};

    if (data.password !== data.confirmPassword) {
      err = { ...err, confirmPassword: "Passwords don't match." };
    }
    if ((data.password?.length ?? 5) < 5) {
      err = { ...err, confirmPassword: "Password is too short" };
    }

    setErrors(err);
    return !Object.keys(err).length;
  };

  return (
    <Modal size="mini" onClose={close} open={isOpen} closeIcon>
      <Header>Change Password</Header>
      <Modal.Content>
        <Form>
          <Form.Field
            name="password"
            value={data.password}
            onChange={(e: { target: { value: any } }) =>
              setData({ ...data, password: e.target.value })
            }
            label="Password"
            control={Input}
            placeholder="Password"
            type="password"
            fluid
            required
          />
          <Form.Field
            name="confirm-password"
            value={data.confirmPassword}
            onChange={(e: { target: { value: any } }) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
            label="Confirm Password"
            control={Input}
            placeholder="Confirm Password"
            type="password"
            fluid
            required
            error={
              errors?.confirmPassword && {
                pointing: "below",
                content: errors?.confirmPassword,
              }
            }
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic inverted onClick={close}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => validate(data) && action(data)}>
          Change Password
        </Button>
      </Modal.Actions>
    </Modal>
  );
};
