export function getAvatarSrc(user) {
  switch (user) {
    case "Joe":
      return "https://chatscope.io/storybook/react/static/media/joe.641da105.svg";
    case "Akane":
      return "https://chatscope.io/storybook/react/static/media/akane.b135c3e3.svg";
    case "Eliot":
      return "https://chatscope.io/storybook/react/static/media/eliot.d7038eac.svg";
    case "Zoe":
      return "https://chatscope.io/storybook/react/static/media/zoe.e31a4ff8.svg";
    default:
      return "https://www.svgrepo.com/show/217250/robot.svg";
  }
}
