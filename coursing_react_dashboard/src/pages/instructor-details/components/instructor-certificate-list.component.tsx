import { Grid } from "@mui/material";
import { IInstructorCertificate } from "apis/instructor/instructor.interfaces";
import InstructorCertificateCard from "./instructor-certificate-card.component";

type Props = {
  items: IInstructorCertificate[];
  handleEditClick: (data: IInstructorCertificate) => void;
  handleRemoveClick: (id: number) => void;
};

function InstructorCertificateList({
  items,
  handleEditClick,
  handleRemoveClick,
}:
  Props) {
  return (
    <Grid container spacing={2}>
      {items.map((item) => (
        <Grid item md={4} key={item.id}>
          <InstructorCertificateCard
            handleEditClick={handleEditClick}
            handleRemoveClick={handleRemoveClick}
            item={item}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default InstructorCertificateList;
