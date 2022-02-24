import { Button, Header, Modal } from "semantic-ui-react";

interface DeleteModalProps {
  isOpen: boolean;
  type: string;
  name: string;
  close: () => void;
  action: () => void;
}

export const DeleteModal = ({
  isOpen,
  close,
  action,
  type,
  name,
}: DeleteModalProps) => (
  <Modal size="mini" onClose={close} open={isOpen} closeIcon>
    <Header>Delete {type}</Header>
    <Modal.Content>
      <p>
        Are you sure you want to delete {type.toLowerCase()} <b>{name}</b>?
      </p>
    </Modal.Content>
    <Modal.Actions>
      <Button basic inverted onClick={close}>
        Cancel
      </Button>
      <Button color="red" onClick={action}>
        Delete
      </Button>
    </Modal.Actions>
  </Modal>
);
