import PDFDocument from "pdfkit"

interface ReportData {
  title: string
  dateRange: string
  user: {
    name: string
    email: string
  }
  projects: Array<{
    name: string
    totalHours: number
    tasksCompleted: number
    tasks: Array<{
      title: string
      status: string
      hours: number
      completedAt?: string
    }>
  }>
  summary: {
    totalHours: number
    totalTasks: number
    completedTasks: number
    productivity: number
  }
}

export class PDFGenerator {
  static async generateTimeReport(data: ReportData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 })
        const chunks: Buffer[] = []

        doc.on("data", (chunk) => chunks.push(chunk))
        doc.on("end", () => resolve(Buffer.concat(chunks)))
        doc.on("error", reject)

        // Header
        doc.fontSize(24).fillColor("#3B82F6").text("TrackFlow Time Report", 50, 50)

        doc.fontSize(12).fillColor("#666666").text(`Generated on ${new Date().toLocaleDateString()}`, 50, 80)

        // User Info
        doc.fontSize(16).fillColor("#000000").text("Report Details", 50, 120)

        doc
          .fontSize(12)
          .fillColor("#333333")
          .text(`User: ${data.user.name}`, 50, 145)
          .text(`Email: ${data.user.email}`, 50, 160)
          .text(`Period: ${data.dateRange}`, 50, 175)

        // Summary Section
        let yPosition = 210
        doc.fontSize(16).fillColor("#000000").text("Summary", 50, yPosition)

        yPosition += 30
        doc
          .fontSize(12)
          .fillColor("#333333")
          .text(`Total Hours Worked: ${data.summary.totalHours}h`, 50, yPosition)
          .text(`Total Tasks: ${data.summary.totalTasks}`, 50, yPosition + 15)
          .text(`Completed Tasks: ${data.summary.completedTasks}`, 50, yPosition + 30)
          .text(`Productivity Rate: ${data.summary.productivity}%`, 50, yPosition + 45)

        // Projects Section
        yPosition += 80
        doc.fontSize(16).fillColor("#000000").text("Project Breakdown", 50, yPosition)

        yPosition += 30
        data.projects.forEach((project, index) => {
          if (yPosition > 700) {
            doc.addPage()
            yPosition = 50
          }

          // Project header
          doc.fontSize(14).fillColor("#3B82F6").text(`${project.name}`, 50, yPosition)

          yPosition += 20
          doc
            .fontSize(12)
            .fillColor("#333333")
            .text(`Hours: ${project.totalHours}h | Tasks Completed: ${project.tasksCompleted}`, 50, yPosition)

          yPosition += 25

          // Tasks table header
          doc
            .fontSize(10)
            .fillColor("#666666")
            .text("Task", 50, yPosition)
            .text("Status", 250, yPosition)
            .text("Hours", 350, yPosition)
            .text("Completed", 450, yPosition)

          yPosition += 15
          doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke("#CCCCCC")

          yPosition += 10

          // Tasks
          project.tasks.forEach((task) => {
            if (yPosition > 720) {
              doc.addPage()
              yPosition = 50
            }

            doc
              .fontSize(10)
              .fillColor("#333333")
              .text(task.title.substring(0, 30), 50, yPosition)
              .text(task.status, 250, yPosition)
              .text(`${task.hours}h`, 350, yPosition)
              .text(task.completedAt ? new Date(task.completedAt).toLocaleDateString() : "-", 450, yPosition)

            yPosition += 15
          })

          yPosition += 20
        })

        // Footer
        const pageCount = doc.bufferedPageRange().count
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i)
          doc
            .fontSize(10)
            .fillColor("#666666")
            .text(`Page ${i + 1} of ${pageCount}`, 50, doc.page.height - 50)
            .text("Generated by TrackFlow", doc.page.width - 150, doc.page.height - 50)
        }

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }

  static async generateProjectReport(projectData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 })
        const chunks: Buffer[] = []

        doc.on("data", (chunk) => chunks.push(chunk))
        doc.on("end", () => resolve(Buffer.concat(chunks)))
        doc.on("error", reject)

        // Header
        doc.fontSize(24).fillColor("#3B82F6").text("Project Report", 50, 50)

        doc.fontSize(18).fillColor("#333333").text(projectData.name, 50, 80)

        doc.fontSize(12).fillColor("#666666").text(`Generated on ${new Date().toLocaleDateString()}`, 50, 105)

        // Project Overview
        let yPosition = 140
        doc.fontSize(16).fillColor("#000000").text("Project Overview", 50, yPosition)

        yPosition += 30
        doc
          .fontSize(12)
          .fillColor("#333333")
          .text(`Status: ${projectData.status}`, 50, yPosition)
          .text(`Start Date: ${new Date(projectData.startDate).toLocaleDateString()}`, 50, yPosition + 15)
          .text(`Due Date: ${new Date(projectData.dueDate).toLocaleDateString()}`, 50, yPosition + 30)
          .text(`Progress: ${projectData.progress}%`, 50, yPosition + 45)

        // Team Members
        yPosition += 80
        doc.fontSize(16).fillColor("#000000").text("Team Members", 50, yPosition)

        yPosition += 30
        projectData.teamMembers.forEach((member: any, index: number) => {
          doc.fontSize(12).fillColor("#333333").text(`${member.name} (${member.role})`, 50, yPosition)
          yPosition += 15
        })

        // Task Summary
        yPosition += 30
        doc.fontSize(16).fillColor("#000000").text("Task Summary", 50, yPosition)

        yPosition += 30
        doc
          .fontSize(12)
          .fillColor("#333333")
          .text(`Total Tasks: ${projectData.totalTasks}`, 50, yPosition)
          .text(`Completed: ${projectData.completedTasks}`, 50, yPosition + 15)
          .text(`In Progress: ${projectData.inProgressTasks}`, 50, yPosition + 30)
          .text(`Pending: ${projectData.pendingTasks}`, 50, yPosition + 45)

        doc.end()
      } catch (error) {
        reject(error)
      }
    })
  }
}
