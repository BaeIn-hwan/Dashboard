import type { CanvasBlock, SimpleBlock } from "@/entities/block";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function simpleBlockInnerHtml(block: SimpleBlock): string {
  switch (block.type) {
    case "image": {
      if (!block.src) return "";
      const img = `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" width="100%" style="display: block; max-width: 100%;" />`;
      if (!block.href) return img;
      return `<a href="${escapeHtml(block.href)}" target="_blank" style="text-decoration: none; display: block; color: #000000; margin: 0; padding: 0; border: 0;">${img}</a>`;
    }

    case "text":
      return `<p style="margin: 0; font-family: Arial, sans-serif; font-size: ${block.fontSize}px; color: ${block.color}; text-align: ${block.align}; line-height: 1.6;">${escapeHtml(block.content)}</p>`;

    case "button":
      return `<a href="${escapeHtml(block.href)}" style="display: inline-block; padding: 12px 32px; background-color: ${block.bgColor}; color: ${block.textColor}; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 4px;">${escapeHtml(block.label)}</a>`;

    case "divider":
      return `<hr style="border: none; border-top: ${block.thickness}px solid ${block.color}; margin: 0;" />`;

    case "spacer":
      return `&nbsp;`;
  }
}

function blockToRow(block: CanvasBlock): string {
  if (block.type === "layout") {
    const colWidth = Math.floor(100 / block.columns);
    const cells = block.cells
      .map((cell) => {
        const content = cell ? simpleBlockInnerHtml(cell) : "&nbsp;";
        return `        <td width="${colWidth}%" valign="top" style="padding: 8px;">${content}</td>`;
      })
      .join("\n");
    return [
      "  <tr>",
      "    <td>",
      '      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">',
      "        <tr>",
      cells,
      "        </tr>",
      "      </table>",
      "    </td>",
      "  </tr>",
    ].join("\n");
  }

  switch (block.type) {
    case "image": {
      let imgContent = "      <!-- 이미지 없음 -->";
      if (block.src) {
        const img = `      <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" width="100%" style="display: block; max-width: 100%;" />`;
        imgContent = block.href
          ? `      <a href="${escapeHtml(block.href)}" target="_blank" style="text-decoration: none; display: block; color: #000000; margin: 0; padding: 0; border: 0;">\n  ${img}\n      </a>`
          : img;
      }
      return [
        "  <tr>",
        `    <td align="${block.align}" style="padding: 0;">`,
        imgContent,
        "    </td>",
        "  </tr>",
      ].join("\n");
    }

    case "text":
      return [
        "  <tr>",
        '    <td style="padding: 16px 24px;">',
        `      <p style="margin: 0; font-family: Arial, sans-serif; font-size: ${block.fontSize}px; color: ${block.color}; text-align: ${block.align}; line-height: 1.6;">${escapeHtml(block.content)}</p>`,
        "    </td>",
        "  </tr>",
      ].join("\n");

    case "button":
      return [
        "  <tr>",
        `    <td align="${block.align}" style="padding: 16px 24px;">`,
        `      <a href="${escapeHtml(block.href)}" style="display: inline-block; padding: 12px 32px; background-color: ${block.bgColor}; color: ${block.textColor}; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; border-radius: 4px;">${escapeHtml(block.label)}</a>`,
        "    </td>",
        "  </tr>",
      ].join("\n");

    case "divider":
      return [
        "  <tr>",
        '    <td style="padding: 8px 24px;">',
        `      <hr style="border: none; border-top: ${block.thickness}px solid ${block.color}; margin: 0;" />`,
        "    </td>",
        "  </tr>",
      ].join("\n");

    case "spacer":
      return [
        "  <tr>",
        `    <td height="${block.height}" style="font-size: 0; line-height: 0;">&nbsp;</td>`,
        "  </tr>",
      ].join("\n");
  }
}

export function blocksToTableHtml(blocks: CanvasBlock[], width = 600, bgColor: "white" | "black" = "white"): string {
  if (blocks.length === 0) return "";
  const rows = blocks.map(blockToRow).join("\n");
  return [
    `<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <meta http-equiv="x-ua-compatible" content="ie=edge" />
          <meta name="x-apple-disable-message-reformatting" />
          <meta
            name="format-detection"
            content="telephone=no,address=no,email=no,date=no,url=no"
          />
          <meta name="color-scheme" content="dark light" />
          <meta name="supported-color-schemes" content="dark light" />
          <title>Hibernate</title>
          <style amp-custom>
            @font-face {
              font-family: ABCFavorit;
              font-weight: 350;
              src:
                url("https://web-resource.gentlemonster.com/assets/fonts/stories/tekken8/ABCFavorit-Book.woff2")
                  format("woff2"),
                url("https://web-resource.gentlemonster.com/assets/fonts/stories/tekken8/ABCFavorit-Book.woff")
                  format("woff"),
                url("https://web-resource.gentlemonster.com/assets/fonts/stories/tekken8/ABCFavorit-Book.otf")
                  format("opentype");
            }

            @font-face {
              font-family: ABCFavorit;
              font-weight: 400;
              src:
                url("https://web-resource.gentlemonster.com/assets/fonts/stories/tekken8/ABCFavorit-Regular.woff2")
                  format("woff2"),
                url("https://web-resource.gentlemonster.com/assets/fonts/stories/tekken8/ABCFavorit-Regular.woff")
                  format("woff"),
                url("https://web-resource.gentlemonster.com/assets/fonts/stories/tekken8/ABCFavorit-Regular.otf")
                  format("opentype");
            }
          </style>
        </head>
        <body
          style="
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: ${bgColor === "black" ? "#000000" : "#ffffff"};
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            visibility: visible !important;
            font-family:
              &quot;ABCFavorit&quot;,
              -apple-system,
              BlinkMacSystemFont,
              &quot;Segoe UI&quot;,
              Roboto,
              &quot;Helvetica Neue&quot;,
              Helvetica,
              Arial,
              sans-serif;
          "
        >
        <!--[if mso]>
        <style type="text/css">
          body,
          table,
          td {
            font-family: Arial, sans-serif !important;
          }
        </style>
        <![endif]-->

        <table
          role="presentation"
          cellpadding="0"
          cellspacing="0"
          border="0"
          align="center"
          width="${width}"
          style="
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            width: 100%;
            max-width: 375px;
            margin: 0 auto;
            padding: 0;
            border: 0;
            background: ${bgColor === "black" ? "#000000" : "#ffffff"};
          "
        >`,
    rows,
    `</table>
        <!-- Open Tracking Pixel -->
        <table
          width="1"
          height="1"
          border="0"
          cellpadding="0"
          cellspacing="0"
          style="font-size: 0; line-height: 0"
        >
          <tr>
            <td>
              <custom name="opencounter" type="tracking" />
            </td>
          </tr>
        </table>
      </body>
    </html>
`,
  ].join("\n");
}
