import { Button, Form, Header, Input, Modal } from "semantic-ui-react";
import { useState } from "react";

export interface ChangePasswordData {
  password: string;
  confirmPassword: string;
}

type ChangePasswordErrors = {
  [key in keyof ChangePasswordData]?: string;
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  close: () => void;
  action: (data: ChangePasswordData) => boolean;
}

export const ChangePasswordModal = ({
  isOpen,
  close,
  action,
}: ChangePasswordModalProps) => {
  const [data, setData] = useState<ChangePasswordData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ChangePasswordErrors>();

  const validate = (data: ChangePasswordData) => {
    if (data.password !== data.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords don't match." });
    } else {
      setErrors({});
      return true;
    }
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
