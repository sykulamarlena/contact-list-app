
type InfoCardProps = {
  data: {
    firstNameLastName: string;
    jobTitle: string;
    emailAddress: string;
  };
  selected: boolean;
  onToggle: () => void;
};

const getInitials = (text: string) => {
  const names = text.split(" ");
  //get the first name and the first letter:
  let initials = names[0].substring(0, 1).toUpperCase();
  //if there are more then one name, takes the first letter of the last name (the one in position names.length - 1):
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
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
