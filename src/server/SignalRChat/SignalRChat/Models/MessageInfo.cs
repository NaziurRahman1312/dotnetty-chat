namespace SignalRChat.Models
{
    public class MessageInfo
    {
        public string Name { get; set; }
        public string Avatar { get; set; }
        public string Message { get; set; }
        public string Direction { get; set; }
        public DateTime SentTime { get; set; }
    }

    public enum Direction
    {
        None,
        Incoming,
        Outgoing
    }
}
