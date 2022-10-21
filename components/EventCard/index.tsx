interface EventProps {
  id: string
  name: string
  eventTimestamp: string
  imageURL: string
}

const EventCard = ({id, name, eventTimestamp, imageURL}: EventProps) => {
  return (
    <div>
      <p>{id}</p>
      <p>{name}</p>
      <p>{eventTimestamp}</p>
      
    </div>
  );
}

export default EventCard;