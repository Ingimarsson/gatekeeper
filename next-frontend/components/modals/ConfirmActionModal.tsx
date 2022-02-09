import { Button, Header, Modal } from "semantic-ui-react";

interface ConfirmActionModalProps {
  isOpen: boolean;
  close: () => void;
  action: () => void;
}

export const ConfirmActionModal = ({
  isOpen,
  close,
  action,
}: ConfirmActionModalProps) => (
  <Modal size="mini" basic onClose={close} open={isOpen}>
    <Header>Confirm Action</Header>
    <Modal.Content>
      <p>Are you sure you want to execute this action?</p>
    </Modal.Content>
    <Modal.Actions>
      <Button basic inverted onClick={close}>
        Cancel
      </Button>
      <Button color="green" onClick={action}>
        Execute
      </Button>
    </Modal.Actions>
  </Modal>
);
