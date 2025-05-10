import React from "react";
import { Dialog, DialogTitle, DialogActions, DialogContent, IconButton } from "@mui/material";
import { BiX } from "react-icons/bi";

const Modal = ({ onClose, title, children, open }) => {
  return (
    <Dialog
      open={open} // Control modal visibility through the `open` prop
      onClose={onClose} // Handle modal close when clicking outside or via close button
      maxWidth="md" // You can adjust the max width as needed
      fullWidth
    >
      <div className="bg-white">
        <DialogTitle>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{title}</h2>
            <IconButton onClick={onClose} color="inherit">
              <BiX className="h-6 w-6" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          {/* You can add action buttons here if needed */}
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default Modal;
