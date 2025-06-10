using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ntlt.projectradar.backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RawLeads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    OriginalContent = table.Column<string>(type: "TEXT", maxLength: 2147483647, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ProcessingStatus = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RawLeads", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RawLeads");
        }
    }
}
