namespace App.API.Session.Models
{
    public class SceneConfiguration {
        public string id { get; set; }
        public string TemplateName { get; set; }
        public string SessionLocation { get; set; }
        public string CashierType { get; set; }
    }

    public class SessionConfiguration {
        public string id { get; set; }
        public string Name { get; set; }
        public string ManagerID { get; set; }
        public SceneConfiguration SceneConfiguration { get; set; }
    }

    public class Session {
        public string id { get; set; }
        public string PlayerID { get; set; }
        public SessionConfiguration SessionConfiguration { get; set; }

        public DateTime StartedAt { get; set; }

        public DateTime EndedAt { get; set; }
    }
    
    public enum MediaType {
        Text,
        Image,
        Audio,
        Video
    }

    public enum Actor {
        Player,
        Bot
    }

    public class Interaction {
        public string id { get; set; }

        public string InResponseTo { get; set; }
        public string SessionID { get; set; }
        public Actor Actor { get; set; }

        public string Media { get; set; }

        public MediaType MediaType { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}