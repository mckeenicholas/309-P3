import ical from "ical";

const parseiCal = (files: FileList) => {
  let events: ical.FullCalendar[] = [];

  const readFile = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          const fileContent = event.target.result as string;
          const data = ical.parseICS(fileContent);
          events.push(data);
          resolve();
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  const readFiles = Array.from(files).map(readFile);

  return Promise.all(readFiles)
    .then(() => {
      return events;
    })
    .catch((error) => {
      console.error("Error reading files:", error);
    });
};

export default parseiCal;
