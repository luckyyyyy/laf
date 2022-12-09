import React, { forwardRef, useImperativeHandle, useState } from "react";
import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { t } from "@lingui/macro";

import IconWrap from "@/components/IconWrap";

import { useAddPackageMutation } from "../service";

type TPackage =
  | {
      name: string;
      version: string;
    }
  | undefined;

const AddDepenceModal = forwardRef((_, ref) => {
  const [item, setItem] = useState<TPackage | any>();
  const [isEdit, setIsEdit] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);

  useImperativeHandle(ref, () => ({
    edit: (item: TPackage) => {
      setItem(item);
      setIsEdit(true);
      onOpen();
    },
  }));

  const addPackageMutation = useAddPackageMutation(() => {
    onClose();
  });

  return (
    <>
      <IconWrap
        tooltip="添加依赖"
        onClick={() => {
          setItem({
            name: "",
            version: "latest",
          });
          setIsEdit(false);
          onOpen();
        }}
      >
        <AddIcon fontSize={10} />
      </IconWrap>

      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t`DependenceTitle`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel>{t`DependenceName`}</FormLabel>
              <Input
                value={item?.name}
                disabled={isEdit}
                onChange={(e) =>
                  setItem({
                    ...item,
                    name: e.target.value,
                  })
                }
                ref={initialRef}
                placeholder={t`DependenceName`}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>{t`DependenceVersion`}</FormLabel>
              <Input
                value={item?.version}
                onChange={(e) =>
                  setItem({
                    ...item,
                    version: e.target.value,
                  })
                }
                placeholder={t`DependenceVersion`}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              isLoading={addPackageMutation.isLoading}
              mr={3}
              onClick={() => {
                addPackageMutation.mutate(item);
              }}
            >
              {t`Confirm`}
            </Button>
            <Button onClick={onClose}>{t`Cancel`}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

AddDepenceModal.displayName = "AddDepenceModal";

export default AddDepenceModal;
