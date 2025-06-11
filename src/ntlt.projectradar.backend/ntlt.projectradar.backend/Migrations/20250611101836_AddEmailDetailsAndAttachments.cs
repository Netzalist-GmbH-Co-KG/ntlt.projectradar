using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ntlt.projectradar.backend.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailDetailsAndAttachments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EmailDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    RawLeadId = table.Column<Guid>(type: "TEXT", nullable: false),
                    EmailFrom = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    EmailTo = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    EmailSubject = table.Column<string>(type: "TEXT", maxLength: 1000, nullable: false),
                    EmailDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EmailBodyText = table.Column<string>(type: "TEXT", maxLength: 2147483647, nullable: false),
                    EmailBodyHtml = table.Column<string>(type: "TEXT", maxLength: 2147483647, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailDetails", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailAttachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    EmailDetailsId = table.Column<Guid>(type: "TEXT", nullable: false),
                    AttachmentFilename = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    AttachmentMimeType = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    AttachmentContent = table.Column<string>(type: "TEXT", maxLength: 2147483647, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EmailAttachments_EmailDetails_EmailDetailsId",
                        column: x => x.EmailDetailsId,
                        principalTable: "EmailDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EmailAttachments_EmailDetailsId",
                table: "EmailAttachments",
                column: "EmailDetailsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailAttachments");

            migrationBuilder.DropTable(
                name: "EmailDetails");
        }
    }
}
