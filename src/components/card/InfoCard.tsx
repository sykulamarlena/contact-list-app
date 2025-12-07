import { getInitials } from "src/utils/text";

type InfoCardProps = {
  data: {
    firstNameLastName: string;
    jobTitle: string;
    emailAddress: string;
  };
  selected: boolean;
  onToggle: () => void;
};

function InfoCard({ data, selected, onToggle }: InfoCardProps) {
  const initialsName = data.firstNameLastName ? getInitials(data.firstNameLastName) : null;

  return (
    <div tabIndex={0} role="button" className={`info-card ${selected ? "selected" : ""}` } onClick={onToggle}>
      <div className="info-card__header">
        <div className="info-card__initials">
          <span>{initialsName}</span>
        </div>
        <div className="info-card__details">
          <span className="info-card__name">{data.firstNameLastName}</span>
          <span className="info-card__job-title">{data.jobTitle}</span>
        </div>
      </div>
      <div className="info-card__email-address">{data.emailAddress}</div>
    </div>
  );
}

export default InfoCard;
