using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ntlt.projectradar.backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectDetailsAndProjectEmails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProjectDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Description = table.Column<string>(type: "TEXT", maxLength: 2147483647, nullable: true),
                    ClientName = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    AgencyName = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    ContactEmail = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    BudgetMin = table.Column<decimal>(type: "TEXT", nullable: true),
                    BudgetMax = table.Column<decimal>(type: "TEXT", nullable: true),
                    Timeline = table.Column<string>(type: "TEXT", maxLength: 500, nullable: true),
                    Technologies = table.Column<string>(type: "TEXT", maxLength: 2000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProjectEmails",
                columns: table => new
                {
                    ProjectId = table.Column<Guid>(type: "TEXT", nullable: false),
                    EmailId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProjectEmails", x => new { x.ProjectId, x.EmailId });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProjectDetails");

            migrationBuilder.DropTable(
                name: "ProjectEmails");
        }
    }
}
